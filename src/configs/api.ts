import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { classifyApiError } from "@/utils/classify-api-error";
import { authEndpoints, publicEndpoints } from "./endpoints";
import { env } from "./env";

axios.defaults.paramsSerializer = { indexes: null };

// ============================================================
// Axios Instances
// ============================================================

const publicAxios = axios.create({
	baseURL: env.SERVER_API_URL,
	headers: { "Content-Type": "application/json" },
});

const authAxios = axios.create({
	baseURL: env.SERVER_API_URL,
	headers: { "Content-Type": "application/json" },
});

// ============================================================
// Error formatting — chỉ cho publicAxios
// authAxios nhận interceptors từ `@/features/auth/lib/auth-interceptors.ts`
// ============================================================

publicAxios.interceptors.response.use(
	(response) => response,
	(error) => {
		throw classifyApiError(error);
	},
);

// ============================================================
// ApiClient — Axios instance + bound endpoints
// ============================================================

type EndpointFn<E> = (endpoints: E) => string;

interface ApiClient<E> {
	get<T = unknown>(
		endpointFn: EndpointFn<E>,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<T>>;
	delete<T = unknown>(
		endpointFn: EndpointFn<E>,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<T>>;
	post<T = unknown>(
		endpointFn: EndpointFn<E>,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<T>>;
	put<T = unknown>(
		endpointFn: EndpointFn<E>,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<T>>;
	patch<T = unknown>(
		endpointFn: EndpointFn<E>,
		data?: unknown,
		config?: AxiosRequestConfig,
	): Promise<AxiosResponse<T>>;
	$axios: AxiosInstance;
}

function createApiClient<E>(
	instance: AxiosInstance,
	endpoints: E,
): ApiClient<E> {
	const resolve = (fn: EndpointFn<E>) => fn(endpoints);

	return {
		get: <T = unknown>(fn: EndpointFn<E>, config?: AxiosRequestConfig) =>
			instance.get<T>(resolve(fn), config),
		delete: <T = unknown>(fn: EndpointFn<E>, config?: AxiosRequestConfig) =>
			instance.delete<T>(resolve(fn), config),
		post: <T = unknown>(
			fn: EndpointFn<E>,
			data?: unknown,
			config?: AxiosRequestConfig,
		) => instance.post<T>(resolve(fn), data, config),
		put: <T = unknown>(
			fn: EndpointFn<E>,
			data?: unknown,
			config?: AxiosRequestConfig,
		) => instance.put<T>(resolve(fn), data, config),
		patch: <T = unknown>(
			fn: EndpointFn<E>,
			data?: unknown,
			config?: AxiosRequestConfig,
		) => instance.patch<T>(resolve(fn), data, config),
		$axios: instance,
	};
}

// ============================================================
// Exported API Clients
// ============================================================

export const publicApi = createApiClient(publicAxios, publicEndpoints);
export const authApi = createApiClient(authAxios, authEndpoints);

export { authAxios, publicAxios };
