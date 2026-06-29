export const publicEndpoints = {
	auth: {
		login: "/auth/login",
		register: "/auth/register",
		refresh: "/auth/refresh-token",
		logout: "/auth/logout",
	},
} as const;

export const authEndpoints = {
	auth: {
		me: "/auth/me",
		revokeSession: (sessionId: string) => `/auth/revoke-token/${sessionId}`,
	},
} as const;
