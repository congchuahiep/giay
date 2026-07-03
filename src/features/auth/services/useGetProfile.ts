import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { authApi } from "@/api";
import type { AppError } from "@/shared/errors";
import { useAuthStore } from "../stores/auth-store";
import {
	type UserProfile,
	type UserProfileDTO,
	userProfileFromDto,
} from "../types";
import AuthKey from "./key";

export default function useGetProfile(
	options?: UseQueryOptions<UserProfile, AppError>,
) {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

	return useQuery<UserProfile, AppError>({
		...options,
		queryKey: AuthKey.profile,
		enabled: isAuthenticated,
		queryFn: async () => {
			const response = await authApi.get<UserProfileDTO>((ep) => ep.auth.me);
			return userProfileFromDto(response.data);
		},
	});
}
