import {
	type UseMutationOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import type { AppError } from "@/shared/errors";
import { AuthCommand } from "@/tauri";
import { useAuthStore } from "../stores/auth-store";
import AuthKey from "./key";

export default function useLogout(
	options?: UseMutationOptions<void, AppError>,
) {
	const queryClient = useQueryClient();

	return useMutation<void, AppError>({
		...options,
		mutationFn: async () => {
			await AuthCommand.logout();
			useAuthStore.getState().clearUser();
		},
		onSuccess: (...args) => {
			queryClient.removeQueries({ queryKey: AuthKey.all });
			options?.onSuccess?.(...args);
		},
	});
}
