import { invoke } from "@tauri-apps/api/core";
import { classifyError } from "@/shared/utils";

async function invokeCommand<T>(
	cmd: string,
	args?: Record<string, unknown>,
): Promise<T> {
	try {
		return await invoke<T>(cmd, args);
	} catch (err) {
		throw classifyError(err);
	}
}

export const AuthCommand = {
	login: (email: string, password: string) =>
		invokeCommand<void>("login", { email, password }),
	logout: () => invokeCommand<void>("logout"),
	checkAuth: () => invokeCommand<boolean>("check_auth"),
};
