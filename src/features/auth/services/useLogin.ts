"use client";

import { publicApi } from "@/api";
import { type UsePostOptions, usePost } from "@/shared/hooks";
import { loginSchema } from "../schemas";
import { useAuthStore } from "../stores";
import type { TokenResponse } from "../types";

type UseLoginOptions = Omit<
	UsePostOptions<typeof loginSchema, TokenResponse>,
	"schema" | "mutationFn" | "defaultValues"
>;

export default function useLogin(options?: UseLoginOptions) {
	return usePost({
		...options,
		schema: loginSchema,
		defaultValues: { email: "", password: "" },

		mutationFn: async (data) => {
			const response = await publicApi.post<TokenResponse>(
				(ep) => ep.auth.login,
				data,
			);

			await useAuthStore
				.getState()
				.saveTokens(response.data.access_token, response.data.refresh_token);

			return response.data;
		},
	});
}
