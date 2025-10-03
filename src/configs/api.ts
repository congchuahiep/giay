import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const endpoint = {
	pages: {
		list: "/pages/",
		create: "/pages/",
		retrieve: (id: string) => `/pages/${id}/`,
		update: (id: string) => `/pages/${id}/`,
		delete: (id: string) => `/pages/${id}/`,
		preview: (id: string) => `/pages/${id}/preview/`,
		children: (id: string) => `/pages/${id}/children/`,
	},
	workspaces: {
		list: "/workspaces/",
		create: "/workspaces/",
		delete: "/workspaces/:id/",
		rootPage: (id: string) => `/workspaces/${id}/root-pages/`,
		user: "/workspaces/user/",
	},
	users: {
		create: "/users/",
		currentUser: "/users/current/",
	},
	auth: {
		getToken: "/api/token/",
		refreshToken: "/api/token/refresh/",
	},
};

export const authApi = (token: string) => {
	return axios.create({
		baseURL: BASE_URL,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

export const api = axios.create({
	baseURL: BASE_URL,
});
