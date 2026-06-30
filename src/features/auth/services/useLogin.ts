import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { publicApi } from "@/api";
import type { AppError } from "@/shared/errors"
import { useAuthStore } from "../stores/auth-store";
import type { LoginRequest, TokenResponse } from "../types";

export default function useLogin(
	options?: UseMutationOptions<void, AppError, LoginRequest>,
) {
	return useMutation<void, AppError, LoginRequest>({
		...options,
		mutationFn: async (data) => {
			const response = await publicApi.post<TokenResponse>(
				(ep) => ep.auth.login,
				data,
			);
			await useAuthStore
				.getState()
				.saveTokens(response.data.access_token, response.data.refresh_token);
		},
	});
}
