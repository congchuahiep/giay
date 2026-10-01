import { Form } from "@formisch/react";
import { IconBrandGoogle, IconCheck } from "@tabler/icons-react";
import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { cn } from "tailwind-variants";
import { useAuthStore, useLogin } from "@/features/auth";
import { InputField } from "@/shared/components/form";
import {
	Alert,
	Button,
	Card,
	Separator,
	Spinner,
} from "@/shared/components/ui";
import { Route as RegisterRoute } from "../register";

type LoginSearch = {
	redirect?: string;
};

const loginSearchSchema = (search: Record<string, unknown>): LoginSearch => ({
	redirect: search.redirect as string | undefined,
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
	const { redirect } = Route.useSearch();
	const redirectTo = redirect || "/";
	const navigate = useNavigate();

	const { form, handleSubmit, status, error } = useLogin({
		onSuccess: () => {
			navigate({ href: redirectTo });
		},
	});

	return (
		<Form of={form} onSubmit={handleSubmit}>
			<Card className="mx-auto w-sm rounded-xl">
				<Card.Content className="flex flex-col gap-4">
					<div>
						<Card.Title>Login</Card.Title>
						<Card.Description>Access to your account</Card.Description>
					</div>

					<Button variant="outline">
						<IconBrandGoogle /> Continue with Google
					</Button>

					<Separator>Or</Separator>

					{status === "error" && (
						<Alert>
							<Alert.Description>{error?.message}</Alert.Description>
						</Alert>
					)}

					<InputField
						of={form}
						path={["email"]}
						type="email"
						label="Email"
						placeholder="your@email.com"
					/>

					<InputField
						of={form}
						path={["password"]}
						type="password"
						label="Password"
						placeholder="*******"
					/>

					<Button
						disabled={status === "pending"}
						className={cn(
							(status === "pending" || status === "success") &&
								"pointer-events-none",
							status === "success" && "bg-green-100 text-foreground",
							"rounded-full",
						)}
						type="submit"
					>
						{status === "pending" ? (
							<Spinner description="Logging in..." />
						) : status === "success" ? (
							<>
								<IconCheck className="size-4" /> Logged in successfully
							</>
						) : (
							"Login"
						)}
					</Button>

					<div className="text-sm text-secondary-foreground text-center">
						<span>New here? </span>

						<Link
							to={RegisterRoute.to}
							tabIndex={-1}
							className="hover:underline text-foreground font-medium"
						>
							Register
						</Link>
					</div>
				</Card.Content>
			</Card>
		</Form>
	);
}
