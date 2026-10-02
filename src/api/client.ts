import { platform } from "@tauri-apps/plugin-os";
import createClient from "openapi-fetch";
import { env } from "@/configs/env";
import { classifyError } from "@/shared/utils";
import type { paths } from "./generated/schema";

export const publicApi = createClient<paths>({ baseUrl: env.SERVER_API_URL });

const PROXY_BASE =
	platform() === "windows"
		? "http://giay-api.localhost"
		: "giay-api://localhost";

export const authApi = createClient<paths>({ baseUrl: PROXY_BASE });

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
