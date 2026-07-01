import * as v from "valibot";

export const loginSchema = v.object({
	email: v.pipe(v.string("Invalid email"), v.email("Invalid email")),
	password: v.pipe(
		v.string("Invalid password"),
		v.minLength(6, "Must be at least 6 characters"),
	),
});

export type LoginFormData = v.InferInput<typeof loginSchema>;
