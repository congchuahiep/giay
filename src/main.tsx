import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { QueryProvider, TanstackDevtoolProvider } from "@/shared/providers";
import { ThemeProvider } from "./features/theme";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
	routeTree,
	context: { queryClient: QueryProvider.queryClient },
	defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryProvider>
				<ThemeProvider>
					<TanstackDevtoolProvider router={router}>
						<RouterProvider router={router} />
					</TanstackDevtoolProvider>
				</ThemeProvider>
			</QueryProvider>
		</StrictMode>,
	);
}
