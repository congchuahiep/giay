import { authEndpoints, publicEndpoints } from "./endpoints";
import { authAxios, publicAxios } from "./instances";
import { setupApiInterceptors } from "./interceptors";
import { createApiClient } from "./types";

setupApiInterceptors(publicAxios);
setupApiInterceptors(authAxios);

export const publicApi = createApiClient(publicAxios, publicEndpoints);
export const authApi = createApiClient(authAxios, authEndpoints);
