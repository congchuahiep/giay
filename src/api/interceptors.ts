import type { AxiosInstance } from "axios";
import { type TokenResponse, useAuthStore } from "@/features/auth";
import { classifyApiError } from "@/shared/utils";
import { publicEndpoints } from "./endpoints";

export function setupPublicInterceptors(instance: AxiosInstance) {
	instance.interceptors.response.use(
		(response) => response,
		(error) => {
			throw classifyApiError(error);
		},
	);
}

export function setupAuthInterceptors(
	instance: AxiosInstance,
	publicInstance: AxiosInstance,
) {
	instance.interceptors.request.use(async (config) => {
		const initialized = useAuthStore.getState().initialized;

		if (!initialized) {
			await useAuthStore.getState().init();
		}

		const token = useAuthStore.getState().accessToken;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	});

	let refreshPromise: Promise<string> | null = null;

	instance.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;

			if (error.response?.status !== 401 || originalRequest._retried) {
				throw error;
			}

			const errorCode: string = error.response?.data?.code;

			if (errorCode === "UNAUTHORIZED") {
				await useAuthStore.getState().clearTokens();
				throw error;
			}

			if (errorCode === "TOKEN_EXPIRED") {
				if (!refreshPromise) {
					refreshPromise = doRefresh().finally(() => {
						refreshPromise = null;
					});
				}

				try {
					const newToken = await refreshPromise;

					originalRequest._retried = true;
					originalRequest.headers.Authorization = `Bearer ${newToken}`;

					return instance(originalRequest);
				} catch (refreshError) {
					await useAuthStore.getState().clearTokens();
					throw refreshError;
				}
			}

			throw error;
		},
	);

	async function doRefresh(): Promise<string> {
		const { refreshToken } = useAuthStore.getState();
		if (!refreshToken) throw new Error("No refresh token");

		const { data } = await publicInstance.post<TokenResponse>(
			publicEndpoints.auth.refresh,
			{
				refresh_token: refreshToken,
			},
		);

		await useAuthStore
			.getState()
			.saveTokens(data.access_token, data.refresh_token);
		return data.access_token;
	}

	instance.interceptors.response.use(
		(response) => response,
		(error) => {
			throw classifyApiError(error);
		},
	);
}
