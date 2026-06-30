import { invoke } from "@tauri-apps/api/core";

export const AuthCommand = {
	saveTokens: (accessToken: string, refreshToken: string) =>
		invoke<void>("save_tokens", { accessToken, refreshToken }),

	getAccessToken: () => invoke<string | null>("get_access_token"),

	getRefreshToken: () => invoke<string | null>("get_refresh_token"),

	clearTokens: () => invoke<void>("clear_tokens"),
};
