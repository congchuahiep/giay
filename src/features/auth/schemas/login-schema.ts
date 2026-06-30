import * as v from "valibot";

export const loginSchema = v.object({
	email: v.pipe(v.string(), v.email("Email không hợp lệ")),
	password: v.pipe(v.string(), v.minLength(1, "Vui lòng nhập mật khẩu")),
});

export type LoginFormData = v.InferInput<typeof loginSchema>;
