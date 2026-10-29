import { useQueryClient } from "@tanstack/react-query";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import AuthKey from "../services/key";
import { useAuthStore } from "../stores/auth-store";

/**
 * Theo dõi trạng thái đăng nhập và tự chuyển về `/login` khi mất session (token
 * hết hạn → proxy xoá token → 401 → `clearUser`). `beforeLoad` ở các route chỉ
 * chạy khi điều hướng, nên cần gate này cho trường hợp đang đứng yên trên trang.
 */
export function AuthGate() {
	const initialized = useAuthStore((s) => s.initialized);
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const routeId = useRouterState({
		select: (state) => state.matches[state.matches.length - 1]?.routeId,
	});

	const isPublicRoute =
		routeId?.startsWith("/(auth)") || routeId?.startsWith("/(public)");

	useEffect(() => {
		if (!initialized || isAuthenticated) return;

		// Dọn cache dữ liệu user cũ để không lộ ra khi đăng nhập tài khoản khác
		queryClient.removeQueries({ queryKey: AuthKey.all });

		if (!isPublicRoute) {
			navigate({ to: "/login", search: { redirect: location.href } });
		}
	}, [initialized, isAuthenticated, isPublicRoute, navigate, queryClient]);

	return <Outlet />;
}
