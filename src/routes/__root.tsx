import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth";
import { AuthGate } from "@/features/auth/components/AuthGate";

export interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	beforeLoad: async () => {
		if (!useAuthStore.getState().initialized) {
			await useAuthStore.getState().init();
		}
	},
	component: AuthGate,
});
