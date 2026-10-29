import { cn } from "tailwind-variants";

export default function Skeleton({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn("animate-pulse rounded-md bg-muted", className)}
			{...props}
		/>
	);
}
