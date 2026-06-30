import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export type EndpointFn<E> = (endpoints: E) => string;

export interface ApiClient<E> {
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

export function createApiClient<E>(
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
