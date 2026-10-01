import { type FormSchema, type FormStore, setErrors } from "@formisch/react";
import type { ValidationError } from "@/shared/errors";

/**
 * Map ValidationError.fields vào Formisch form errors
 *
 * @example
 * ```
 * // Server trả về:
 * { "code": "invalid", "role": ["Cannot set role to OWNER..."] }
 *
 * // Sẽ gọi:
 * setErrors(form, { path: ["role"], errors: ["Cannot set role to OWNER..."] })
 * ```
 *
 * @note Hiện tại chỉ hỗ trợ top-level fields. Nếu server trả về lỗi lồng
 * nhau (ví dụ `user.email`), cần mở rộng helper để parse path.
 */
export default function setFormValidationErrors<TSchema extends FormSchema>(
	form: FormStore<TSchema>,
	error: ValidationError,
) {
	for (const [field, messages] of Object.entries(error.fields)) {
		setErrors(form as never, {
			path: [field] as [string],
			errors: messages as [string, ...string[]],
		} as never);
	}
}
