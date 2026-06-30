import axios from "axios";
import { env } from "@/configs/env";

axios.defaults.paramsSerializer = { indexes: null };

export const publicAxios = axios.create({
	baseURL: env.SERVER_API_URL,
	headers: { "Content-Type": "application/json" },
});

export const authAxios = axios.create({
	baseURL: env.SERVER_API_URL,
	headers: { "Content-Type": "application/json" },
});
