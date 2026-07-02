import type { AxiosInstance } from "axios";
import { classifyError } from "@/shared/utils";

/**
 * The basic interceptor, mapping axios error into `AppError`
 */
export function setupApiInterceptors(instance: AxiosInstance) {
	instance.interceptors.response.use(
		(response) => response,
		(error) => {
			throw classifyError(error);
		},
	);
}
