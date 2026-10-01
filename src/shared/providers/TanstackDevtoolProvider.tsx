import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import type { AnyRouter } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import AuthStorePanel from "@/devtools/AuthStorePanel";

const isDev = import.meta.env.DEV;

export function TanstackDevtoolProvider({
	children,
	router,
}: {
	children: React.ReactNode;
	router: AnyRouter;
}) {
	if (!isDev) return <>{children}</>;

	return (
		<>
			<TanStackDevtools
				plugins={[
					{
						name: "TanStack Query",
						render: <ReactQueryDevtoolsPanel />,
					},
					{
						name: "TanStack Router",
						render: <TanStackRouterDevtoolsPanel router={router} />,
					},
					{
						name: "Auth Store",
						render: <AuthStorePanel />,
					},
				]}
			/>
			{children}
		</>
	);
}
