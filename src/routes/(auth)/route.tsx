import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex flex-col min-h-screen justify-center">
			<Outlet />
		</main>
	);
}
