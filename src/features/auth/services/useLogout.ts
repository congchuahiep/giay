import {
	type UseMutationOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { publicApi } from "@/api";
import type { AppError } from "@/shared/errors";
import { useAuthStore } from "../stores/auth-store";
import AuthKey from "./key";

export default function useLogout(
	options?: UseMutationOptions<void, AppError>,
) {
	const queryClient = useQueryClient();

	return useMutation<void, AppError>({
		...options,
		mutationFn: async () => {
			const { refreshToken } = useAuthStore.getState();
			if (refreshToken) {
				await publicApi.post((ep) => ep.auth.logout, {
					refresh_token: refreshToken,
				});
			}
			await useAuthStore.getState().clearTokens();
		},
		onSuccess: (...args) => {
			queryClient.removeQueries({ queryKey: AuthKey.all });
			options?.onSuccess?.(...args);
		},
	});
}
