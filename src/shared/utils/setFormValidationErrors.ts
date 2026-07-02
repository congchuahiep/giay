import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import type { ValidationError } from "@/shared/errors";

/**
 * Map ValidationError.fields vào React Hook Form errors
 *
 * @example
 * ```
 * // Server trả về:
 * { "code": "invalid", "role": ["Cannot set role to OWNER..."] }
 *
 * // Sẽ gọi:
 * form.setError("role", { type: "server", message: "Cannot set role to OWNER..." })
 * ```
 */
export default function setFormValidationErrors<T extends FieldValues>(
	form: UseFormReturn<T>,
	error: ValidationError,
) {
	for (const [field, messages] of Object.entries(error.fields)) {
		// Ghép nhiều message thành 1 chuỗi (RHF chỉ hỗ trợ 1 message per setError)
		form.setError(field as Path<T>, {
			type: "server",
			message: messages.join("\n"),
		});
	}
}
