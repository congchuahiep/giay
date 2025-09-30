/** biome-ignore-all lint/correctness/useUniqueElementIds: Id use for input elements */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, endpoint } from "@/configs/api";
import { useAuthStore } from "@/stores/auth";
import Titlebar from "@/components/Titlebar/Titlebar";
import { useNavigate } from "react-router-dom";

function validateEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginWindow() {
	const navigate = useNavigate();

	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const { setToken } = useAuthStore();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// Validation
		if (!username || !password || (!isLogin && (!email || !confirmPassword))) {
			setError("All fields are required.");
			return;
		}
		if (!isLogin && !validateEmail(email)) {
			setError("Invalid email address.");
			return;
		}
		if (password.length < 6) {
			setError("Password must be at least 6 characters.");
			return;
		}
		if (!isLogin && password !== confirmPassword) {
			setError("Password confirmation does not match.");
			return;
		}

		setLoading(true);

		try {
			if (isLogin) {
				const res = await api.post(endpoint.auth.getToken, {
					username,
					password,
				});
				const token = res.data?.access || res.data?.token;
				if (token) setToken(token);
				else setError("Login failed!");
				navigate("/");
			} else {
				await api.post(endpoint.users.create, {
					email,
					password,
					username,
				});
				// Auto login after register
				const res = await api.post(endpoint.auth.getToken, {
					username,
					password,
				});
				const token = res.data?.access || res.data?.token;
				if (token) setToken(token);
				else setError("Registered but login failed!");
				navigate("/");
			}
		} catch (err: any) {
			setError(err?.response?.data?.detail || "Something went wrong!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background">
			<Titlebar />
			<div className="w-full max-w-sm p-8 rounded shadow bg-popover">
				<h2 className="text-4xl font-bold mb-12 text-center">
					{isLogin ? "Login" : "Register"}
				</h2>
				<form className="space-y-4" onSubmit={handleSubmit} noValidate>
					{!isLogin && (
						<>
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								placeholder="Username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</>
					)}
					{isLogin && (
						<>
							<Label htmlFor="username">Username</Label>
							<Input
								id="username"
								type="text"
								placeholder="Username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</>
					)}
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{!isLogin && (
						<>
							<Label htmlFor="confirm-password">Confirm Password</Label>
							<Input
								id="confirm-password"
								type="password"
								placeholder="Confirm Password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</>
					)}
					{error && <div className="text-red-500 text-sm">{error}</div>}
					<Button
						className="w-full mt-4 cursor-pointer"
						type="submit"
						disabled={loading}
					>
						{loading ? "Processing..." : isLogin ? "Login" : "Register"}
					</Button>
				</form>
				<div className="mt-4 text-center flex text-sm items-center justify-center gap-2">
					<span>
						{isLogin ? "Don't have an account?" : "Already have an account?"}
					</span>
					<Button
						variant="link"
						type="button"
						className="p-0 cursor-pointer"
						onClick={() => {
							setIsLogin((v) => !v);
							setError(null);
						}}
					>
						{isLogin ? "Register" : "Login"}
					</Button>
				</div>
			</div>
		</div>
	);
}
