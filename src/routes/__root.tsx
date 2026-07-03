import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth";

export interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	beforeLoad: async () => {
		if (!useAuthStore.getState().initialized) {
			await useAuthStore.getState().init();
		}
	},
	component: RootLayout,
});

function RootLayout() {
	return <Outlet />;
}
