import type { AxiosError } from "axios";
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
 * Classifies an Axios error and returns an `AppError` instance. This function
 * handles errors that occur during fetch requests and returns a standardized
 * `AppError` instance.
 *
 * # Example
 *
 * ```ts
 * try {
 *   const response = await axios.get("/api/endpoint");
 * } catch (error) {
 *   const appError = classifyApiError(error);
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
export default function classifyApiError(error: unknown): AppError {
	if (error instanceof AppError) return error;

	if (!axios.isAxiosError(error)) {
		return new AppError(
			(error as Error).message || "Lỗi không xác định",
			500,
			"UNKNOWN_ERROR",
		);
	}

	const err = error as AxiosError;

	if (!err.response) {
		switch (true) {
			case err.code === "ECONNABORTED" || err.message.includes("timeout"):
				return new TimeoutError();
			case err.code === "ERR_NETWORK" || err.code === "ECONNREFUSED":
				return new NetworkError("Không tìm thấy máy chủ hoặc mất kết nối mạng");
			default:
				return new NetworkError(err.message);
		}
	}

	const { status } = err.response;
	const data = err.response.data as Record<string, unknown> | undefined;
	const message = extractErrorMessage(error, true) as string;
	const apiCode = (data?.code as string) ?? err.code ?? "API_ERROR";

	switch (true) {
		case status === 400:
			return handleBadRequest(data);
		case status === 401:
			return new AuthError(message, apiCode);
		case status === 403:
			return new ForbiddenError(message, apiCode);
		case status === 404:
			return new NotFoundError(message, apiCode);
		case status >= 500:
			return new ServerError(
				`Lỗi máy chủ (${status}): ${message}`,
				status,
				apiCode,
			);
		default:
			return new AppError(message, status, apiCode);
	}
}

/**
 * Handles bad request errors and returns an `AppError` instance. This
 * function extracts field errors from the response data and returns a
 * detailed error message if available.
 */
function handleBadRequest(data?: Record<string, unknown>): AppError {
	if (!data || typeof data !== "object") {
		return new AppError("Invalid request", 400, "BAD_REQUEST");
	}

	const { code, details, ...rest } = data;
	const apiCode = (code as string) ?? "BAD_REQUEST";

	const fieldErrors: Record<string, string[]> = {};

	if (details && typeof details === "object" && !Array.isArray(details)) {
		for (const [key, value] of Object.entries(details as Record<string, unknown>)) {
			if (typeof value === "string") {
				fieldErrors[key] = [value];
			} else if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
				fieldErrors[key] = value as string[];
			}
		}
	} else {
		for (const [key, value] of Object.entries(rest)) {
			if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
				fieldErrors[key] = value as string[];
			}
		}
	}

	let mainMessage: string | undefined;
	const extractedMsg = extractErrorMessage(data, true) as string;
	if (extractedMsg !== "Lỗi không xác định" && extractedMsg !== "") {
		mainMessage = extractedMsg;
	}

	if (Object.keys(fieldErrors).length > 0) {
		const fallback =
			Object.values(fieldErrors).flat()[0] ?? "Dữ liệu không hợp lệ";
		return new ValidationError(mainMessage ?? fallback, fieldErrors, apiCode);
	}

	return new AppError(mainMessage ?? "Yêu cầu không hợp lệ", 400, apiCode);
}

function extractErrorMessage(error: unknown, stringOnly: true): string;
function extractErrorMessage(
	error: unknown,
	stringOnly?: false,
): string | Record<string, unknown>;
function extractErrorMessage(
	error: unknown,
	stringOnly = true,
): string | Record<string, unknown> {
	let data: unknown;

	if (error instanceof axios.AxiosError) {
		data = error.response?.data;
	} else {
		data = error;
	}

	if (!data) return stringOnly ? "Lỗi không xác định" : {};

	if (typeof data === "string") return data;

	if (typeof data === "object" && data !== null) {
		const obj = data as Record<string, unknown>;
		if (typeof obj.message === "string") return stringOnly ? obj.message : obj;
		if (typeof obj.detail === "string") return stringOnly ? obj.detail : obj;
	}

	return stringOnly ? "Lỗi không xác định" : (data as Record<string, unknown>);
}
