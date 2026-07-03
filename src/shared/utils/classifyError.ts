import axios from "axios";
import {
	AppError,
	AuthError,
	ForbiddenError,
	NetworkError,
	NotFoundError,
	ServerError,
	TimeoutError,
	ValidationError,
} from "@/shared/errors";

/**
 * Classifies an error and returns an `AppError` instance. This function
 * handles errors that occur during fetch requests and returns a standardized
 * `AppError` instance.
 *
 * The error can be an Axios error, or pure json
 *
 * # Example
 *
 * ```ts
 * try {
 *   const response = await axios.get("/api/endpoint");
 * } catch (error) {
 *   const appError = classifyError(error);
 *   throw appError;
 * }
 * ```
 *
 * # Error Response Structure
 *
 * The server will always return error responses with a consistent structure
 * like this:
 *
 * ```json
 * {
 *   "code": "ERROR_CODE",
 *   "message": "Error message",
 *   "details": { ... }
 * }
 * ```
 *
 * The details field contains additional error information if available, usually
 * appears when the server returns a validation error.
 *
 * ```json
 * {
 *   "code": "VALIDATION_ERROR",
 *   "message": "Validation failed",
 *   "details": {
 *     "field1": "Invalid value",
 *     "field2": "Required field",
 *     ...
 *   }
 * }
 * ```
 */
export default function classifyError(error: unknown): AppError {
	if (error instanceof AppError) return error;

	return classify(normalize(error));
}

interface NormalizedError {
	code: string;
	message: string;
	details?: Record<string, unknown>;
	status?: number;
}

function normalize(error: unknown): NormalizedError {
	console.error(error);

	if (axios.isAxiosError(error)) {
		if (!error.response) {
			if (error.code === "ECONNABORTED" || error.message.includes("timeout"))
				return { code: "TIMEOUT_ERROR", message: "Kết nối quá hạn (Timeout)" };
			return {
				code: "NETWORK_ERROR",
				message: "Không tìm thấy máy chủ hoặc mất kết nối mạng",
			};
		}

		const { status, data } = error.response;
		const body = data as Record<string, unknown> | undefined;

		return {
			code: (body?.code as string) ?? `HTTP_${status}`,
			message: extractMessage(body) ?? `Lỗi máy chủ (${status})`,
			details: body?.details as Record<string, unknown> | undefined,
			status,
		};
	}

	if (typeof error === "object" && error !== null) {
		const body = error as Record<string, unknown>;
		return {
			code:
				typeof body.code === "string"
					? body.code.toUpperCase()
					: "UNKNOWN_ERROR",
			message: extractMessage(body) ?? "Unknown error",
			details: body.details as Record<string, unknown> | undefined,
		};
	}

	return {
		code: "UNKNOWN_ERROR",
		message: typeof error === "string" ? error : "Unknown error",
	};
}

function classify(err: NormalizedError): AppError {
	const { code, message, details, status } = err;

	// Phase 1: theo code (chính xác nhất)
	switch (code) {
		case "NETWORK_ERROR":
			return new NetworkError(message);
		case "TIMEOUT_ERROR":
			return new TimeoutError(message);
		case "VALIDATION_ERROR":
			return new ValidationError(message, code, extractFieldErrors(details));
		case "UNAUTHORIZED":
		case "TOKEN_EXPIRED":
		case "INVALID_CREDENTIALS":
			return new AuthError(message, code);
		case "FORBIDDEN":
		case "PERMISSION_DENIED":
			return new ForbiddenError(message, code);
		case "NOT_FOUND":
			return new NotFoundError(message, code);
		// BFF-specific codes
		case "KEYRING_ERROR":
			return new AppError(message, 500, code);
		case "BAD_RESPONSE":
			return new ServerError(message, 502, code);
	}

	// Phase 2: fallback theo HTTP status (nếu code không match)
	if (status) {
		switch (true) {
			case status === 400:
				return handleBadRequest(message, code, details);
			case status === 401:
				return new AuthError(message, code);
			case status === 403:
				return new ForbiddenError(message, code);
			case status === 404:
				return new NotFoundError(message, code);
			case status >= 500:
				return new ServerError(
					`Lỗi máy chủ (${status}): ${message}`,
					status,
					code,
				);
		}
	}

	return new AppError(message, status ?? 500, code);
}

/**
 * Handles bad request errors and returns an `AppError` instance. This
 * function extracts field errors from the response data and returns a
 * detailed error message if available.
 */
function handleBadRequest(
	message: string,
	code: string,
	details: Record<string, unknown> | undefined,
): AppError {
	const fieldErrors = extractFieldErrors(details);
	if (Object.keys(fieldErrors).length > 0) {
		return new ValidationError(message, code, fieldErrors);
	}
	return new AppError(message, 400, code);
}

function extractFieldErrors(
	details: Record<string, unknown> | undefined,
): Record<string, string[]> {
	if (!details || typeof details !== "object" || Array.isArray(details))
		return {};

	const fieldErrors: Record<string, string[]> = {};
	for (const [key, value] of Object.entries(details)) {
		if (typeof value === "string") {
			fieldErrors[key] = [value];
		} else if (
			Array.isArray(value) &&
			value.every((v) => typeof v === "string")
		) {
			fieldErrors[key] = value as string[];
		}
	}
	return fieldErrors;
}

function extractMessage(
	data: Record<string, unknown> | undefined,
): string | undefined {
	if (!data) return undefined;
	if (typeof data.message === "string") return data.message;
	if (typeof data.detail === "string") return data.detail;
	return undefined;
}
