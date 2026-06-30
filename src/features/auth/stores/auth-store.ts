import { create } from "zustand";
import { AuthCommand } from "@/tauri";
import type { User } from "../types";

interface AuthState {
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	user: User | null;
	initialized: boolean;

	init: () => Promise<void>;
	saveTokens: (accessToken: string, refreshToken: string) => Promise<void>;
	clearTokens: () => Promise<void>;
	setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	user: null,
	initialized: false,

	init: async () => {
		try {
			const accessToken = await AuthCommand.getAccessToken();
			const refreshToken = await AuthCommand.getRefreshToken();
			if (accessToken) {
				set({
					accessToken,
					refreshToken,
					isAuthenticated: true,
					initialized: true,
				});
			} else {
				set({ initialized: true });
			}
		} catch {
			set({ initialized: true });
		}
	},

	saveTokens: async (accessToken, refreshToken) => {
		await AuthCommand.saveTokens(accessToken, refreshToken);
		set({ accessToken, refreshToken, isAuthenticated: true });
	},

	clearTokens: async () => {
		await AuthCommand.clearTokens();
		set({
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
			user: null,
		});
	},

	setUser: (user) => set({ user }),
}));
