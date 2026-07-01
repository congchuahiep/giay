import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthStore, useLogin } from "@/features/auth";

const loginSearchSchema = (search: Record<string, unknown>) => ({
	redirect: (search.redirect as string) || "/",
});

export const Route = createFileRoute("/(auth)/login/")({
	validateSearch: loginSearchSchema,
	beforeLoad: () => {
		if (useAuthStore.getState().isAuthenticated) {
			throw redirect({ to: "/" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	const { redirect: redirectTo } = Route.useSearch();
	const navigate = useNavigate();
	const loginMutation = useLogin();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		try {
			await loginMutation.mutateAsync({ email, password });
			navigate({ to: redirectTo });
		} catch {
			// Lỗi đã được xử lý bởi error formatting interceptor
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-4"
			>
				<h1 className="text-2xl font-bold text-center">Đăng nhập</h1>

				{loginMutation.isError && (
					<div className="bg-red-50 text-red-600 p-3 rounded text-sm">
						{(loginMutation.error as Error).message}
					</div>
				)}

				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="w-full border rounded-lg px-3 py-2"
				/>

				<input
					type="password"
					placeholder="Mật khẩu"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="w-full border rounded-lg px-3 py-2"
				/>

				<button
					type="submit"
					disabled={loginMutation.isPending}
					className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-50"
				>
					{loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
				</button>
			</form>
		</div>
	);
}
