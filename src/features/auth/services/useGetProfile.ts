import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { authApi } from "@/api";
import type { AppError } from "@/shared/errors";
import { useAuthStore } from "../stores/auth-store";
import type { User, UserProfileDTO } from "../types";
import AuthKey from "./key";

export default function useGetProfile(
	options?: UseQueryOptions<User, AppError>,
) {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	return useQuery<User, AppError>({
		...options,
		queryKey: AuthKey.profile,
		queryFn: async () => {
			const response = await authApi.get<UserProfileDTO>((ep) => ep.auth.me);
			return response.data;
		},
		enabled: isAuthenticated,
		staleTime: 5 * 60 * 1000,
	});
}
