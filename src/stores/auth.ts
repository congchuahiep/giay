import { create } from "zustand";
import type { User } from "@/types";
import { api, endpoint } from "@/configs";

interface AuthState {
	token: string | null;
	setToken: (token: string) => void;
	clearToken: () => void;
	isAuthenticated: boolean;
	getCurrentUser: () => Promise<User | null>;
}

const TOKEN_KEY = "jwt_token";

export const useAuthStore = create<AuthState>((set) => ({
	token: localStorage.getItem(TOKEN_KEY),
	isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
	setToken: (token: string) => {
		localStorage.setItem(TOKEN_KEY, token);
		set({ token, isAuthenticated: true });
	},
	clearToken: () => {
		localStorage.removeItem(TOKEN_KEY);
		set({ token: null, isAuthenticated: false });
	},

	getCurrentUser: async () => {
		const token = localStorage.getItem(TOKEN_KEY);
		if (!token) return null;

		return await api
			.get(endpoint.users.currentUser, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.error(error);
				return null;
			});
	},
}));
