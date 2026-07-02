export const publicEndpoints = {
	auth: {
		register: "/auth/register",
	},
} as const;

export const authEndpoints = {
	auth: {
		me: "/auth/me",
		revokeSession: (sessionId: string) => `/auth/revoke-token/${sessionId}`,
	},
} as const;
