import { platform } from "@tauri-apps/plugin-os";
import createClient from "openapi-fetch";
import { env } from "@/configs/env";
import { useAuthStore } from "@/features/auth/stores";
import { classifyError } from "@/shared/utils";
import type { paths } from "./generated/schema";

export const publicApi = createClient<paths>({ baseUrl: env.SERVER_API_URL });

const PROXY_BASE =
	platform() === "windows"
		? "http://giay-api.localhost"
		: "giay-api://localhost";

/**
 * Mọi request qua `authApi` đều đi qua proxy Rust (tự gắn Bearer token và refresh
 * khi 401). Nếu proxy vẫn trả 401 nghĩa là session đã chết (refresh thất bại hoặc
 * token hết hạn) → báo store xoá user, `AuthGate` trong root layout sẽ redirect về
 * trang đăng nhập.
 */
async function authFetch(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<Response> {
	const response = await fetch(input, init);
	if (response.status === 401) {
		const { isAuthenticated, clearUser } = useAuthStore.getState();
		if (isAuthenticated) clearUser();
	}
	return response;
}

export const authApi = createClient<paths>({
	baseUrl: PROXY_BASE,
	fetch: authFetch,
});

type FetchResult<T> = { data?: T; error?: unknown };

/**
 * openapi-fetch trả `{ data, error }` thay vì throw. Cơ chế này nằm chỉ trả về
 * data và throw error nếu có
 */
export function unwrap<T>(result: FetchResult<T>): T {
	const { data, error } = result;
	if (error !== undefined) throw classifyError(error);
	return data as T;
}
