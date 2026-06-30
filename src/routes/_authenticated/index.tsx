import { createFileRoute } from "@tanstack/react-router";
import { useGetProfile, useLogout } from "@/features/auth";

export const Route = createFileRoute("/_authenticated/")({
	component: HomePage,
});

function HomePage() {
	const { data: user, isLoading } = useGetProfile();
	const logoutMutation = useLogout();

	const handleLogout = async () => {
		await logoutMutation.mutateAsync();
		window.location.href = "/login";
	};

	return (
		<div className="p-8">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">
					{isLoading ? "Đang tải..." : `Xin chào, ${user?.email ?? "bạn"}!`}
				</h1>
				<button
					onClick={handleLogout}
					disabled={logoutMutation.isPending}
					className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
				>
					{logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
				</button>
			</div>
		</div>
	);
}
