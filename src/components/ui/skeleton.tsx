import { cn } from "@/utils/index";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn(
				"bg-stone-400/20  dark:bg-stone-600/20 animate-pulse rounded-md",
				className,
			)}
			{...props}
		/>
	);
}

export { Skeleton };
