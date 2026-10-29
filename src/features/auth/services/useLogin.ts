"use client";

import { usePost } from "@/shared/hooks";
import { AuthCommand } from "@/tauri";
import { loginSchema } from "../schemas";
import { useAuthStore } from "../stores";

type UseLoginOptions = Omit<
	usePost.Options<typeof loginSchema, void>,
	"schema" | "mutationFn"
>;

export default function useLogin(options?: UseLoginOptions) {
	return usePost({
		...options,
		schema: loginSchema,
		initialInput: { email: "", password: "" },

		mutationFn: async ({ email, password }) => {
			await AuthCommand.login(email, password);
			await useAuthStore.getState().init();
		},
	});
}
