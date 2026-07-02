import { create } from "zustand";
import { AuthCommand } from "@/tauri";
import type { User } from "../types";

interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	initialized: boolean;

	init: () => Promise<void>;
	setUser: (user: User) => void;
	clearUser: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
	user: null,
	isAuthenticated: false,
	initialized: false,

	init: async () => {
		try {
			const isAuth = await AuthCommand.checkAuth();
			set({ isAuthenticated: isAuth, initialized: true });
		} catch {
			set({ initialized: true });
		}
	},

	setUser: (user) => set({ user, isAuthenticated: true }),
	clearUser: () => set({ user: null, isAuthenticated: false }),
}));
