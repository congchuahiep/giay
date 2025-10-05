import { SpinnerIcon } from "@phosphor-icons/react/dist/csr/Spinner";

import { cn } from "@/utils/index";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
	return (
		<SpinnerIcon
			role="status"
			aria-label="Loading"
			className={cn("size-4 animate-spin", className)}
			{...props}
		/>
	);
}

export { Spinner };
