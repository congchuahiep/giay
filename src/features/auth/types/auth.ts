export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	name: string;
	password: string;
}

export interface TokenResponse {
	access_token: string;
	refresh_token: string;
}

export interface RefreshRequest {
	refresh_token: string;
}
