import * as v from "valibot";

export const registerSchema = v.pipe(
	v.object({
		email: v.pipe(v.string("Invalid format"), v.email("Invalid email address")),
		password: v.pipe(
			v.string("Invalid format"),
			v.minLength(8, "Password must be at least 8 characters long"),
		),
		confirmPassword: v.pipe(
			v.string("Invalid format"),
			v.minLength(8, "Password must be at least 8 characters long"),
		),
		firstName: v.pipe(
			v.string("Invalid format"),
			v.minLength(1, "Please enter your first name"),
		),
		lastName: v.pipe(
			v.string("Invalid format"),
			v.minLength(1, "Please enter your last name"),
		),
		inviteToken: v.optional(
			v.pipe(
				v.string("Invalid format"),
				v.minLength(1, "Please enter the invite token"),
			),
		),
	}),
	v.forward(
		v.partialCheck(
			[["password"], ["confirmPassword"]],
			(input) => input.password === input.confirmPassword,
			"The passwords do not match",
		),
		["confirmPassword"],
	),
	v.transform((input) => ({
		email: input.email,
		password: input.password,
		first_name: input.firstName,
		last_name: input.lastName,
		invite_token: input.inviteToken,
	})),
);

export type RegisterFormData = v.InferInput<typeof registerSchema>;
