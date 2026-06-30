import { authEndpoints, publicEndpoints } from "./endpoints";
import { authAxios, publicAxios } from "./instances";
import { setupAuthInterceptors, setupPublicInterceptors } from "./interceptors";
import { createApiClient } from "./types";

setupPublicInterceptors(publicAxios);
setupAuthInterceptors(authAxios, publicAxios);

export const publicApi = createApiClient(publicAxios, publicEndpoints);
export const authApi = createApiClient(authAxios, authEndpoints);
