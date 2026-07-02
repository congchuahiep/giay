import { platform } from "@tauri-apps/plugin-os";
import axios from "axios";
import { env } from "@/configs/env";

axios.defaults.paramsSerializer = { indexes: null };

export const publicAxios = axios.create({
	baseURL: env.SERVER_API_URL,
	headers: { "Content-Type": "application/json" },
});

const PROXY_BASE =
	platform() === "windows"
		? "http://giay-api.localhost"
		: "giay-api://localhost";

export const authAxios = axios.create({
	baseURL: PROXY_BASE,
	headers: { "Content-Type": "application/json" },
});
