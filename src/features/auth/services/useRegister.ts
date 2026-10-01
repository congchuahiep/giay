"use client";

import { type UsePostOptions, usePost } from "@/shared/hooks";
import { AuthCommand } from "@/tauri";
import { registerSchema } from "../schemas";
import { useAuthStore } from "../stores";

type UseRegisterOptions = Omit<
	UsePostOptions<typeof registerSchema, void>,
	"schema" | "mutationFn"
>;

export default function useRegister(options?: UseRegisterOptions) {
	return usePost({
		...options,
		schema: registerSchema,
		initialInput: {
			email: "",
			password: "",
			confirmPassword: "",
			firstName: "",
			lastName: "",
			inviteToken: undefined,
		},

		mutationFn: async (data) => {
			await AuthCommand.register(data);
			await useAuthStore.getState().init();
		},
	});
}
