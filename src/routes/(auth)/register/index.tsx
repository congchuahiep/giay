import { Form } from "@formisch/react";
import { IconBrandGoogle, IconCheck } from "@tabler/icons-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { cn } from "tailwind-variants";
import { useRegister } from "@/features/auth";
import { Route as HomeRoute } from "@/routes/(app)/index";
import { InputField } from "@/shared/components/form";
import {
	Alert,
	Button,
	Card,
	Separator,
	Spinner,
} from "@/shared/components/ui";
import { Route as LoginRoute } from "../login";

export const Route = createFileRoute("/(auth)/register/")({
	component: RegisterPage,
});

function RegisterPage() {
	const navigate = useNavigate();

	const { form, handleSubmit, status, error } = useRegister({
		onSuccess: () => {
			navigate({ to: HomeRoute.to });
		},
	});

	return (
		<Form of={form} onSubmit={handleSubmit}>
			<Card className="mx-auto w-sm rounded-xl">
				<Card.Content className="flex flex-col gap-4">
					<div>
						<Card.Title>Register</Card.Title>
						<Card.Description>Create your account</Card.Description>
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

					<div className="grid grid-cols-7 gap-2">
						<InputField
							className="col-span-4"
							of={form}
							path={["firstName"]}
							label="First Name"
							placeholder="Severus"
						/>
						<InputField
							className="col-span-3"
							of={form}
							path={["lastName"]}
							label="Last Name"
							placeholder="Snape"
						/>
					</div>

					<InputField
						of={form}
						path={["password"]}
						type="password"
						label="Password"
						placeholder="*******"
					/>

					<InputField
						of={form}
						path={["confirmPassword"]}
						type="password"
						label="Confirm Password"
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
							<Spinner description="Registering..." />
						) : status === "success" ? (
							<>
								<IconCheck className="size-4" /> Register successfully
							</>
						) : (
							"Register"
						)}
					</Button>

					<div className="text-sm text-secondary-foreground text-center">
						<span>Already have an account? </span>

						<Link
							to={LoginRoute.to}
							tabIndex={-1}
							className="hover:underline text-foreground font-medium"
						>
							Login
						</Link>
					</div>
				</Card.Content>
			</Card>
		</Form>
	);
}
