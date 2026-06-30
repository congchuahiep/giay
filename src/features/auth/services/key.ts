const AuthKey = {
	all: ["auth"] as const,
	profile: ["auth", "profile"] as const,
} as const;

export default AuthKey;
