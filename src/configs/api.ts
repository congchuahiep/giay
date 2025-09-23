import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const endpoint = {
	pages: {
		list: "/pages/",
		create: "/pages/",
		retrieve: (id: string) => `/pages/${id}/`,
		update: (id: string) => `/pages/${id}/`,
		delete: (id: string) => `/pages/${id}/`,
	},
	workspaces: {
		list: "/workspaces/",
		create: "/workspaces/",
		update: "/workspaces/:id/",
		delete: "/workspaces/:id/",
		rootPage: (id: string) => `/workspaces/${id}/root-pages/`,
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
