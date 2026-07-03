import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { cn } from "tailwind-variants";

export interface SeparatorProps extends BaseSeparator.Props {
	children?: React.ReactNode;
}

export default function Separator({
	className,
	orientation = "horizontal",
	children,
	...props
}: SeparatorProps) {
	if (!children) {
		return (
			<BaseSeparator
				data-slot="separator"
				orientation={orientation}
				className={cn(
					"bg-border shrink-0",
					"data-[orientation=horizontal]:h-px",
					"data-[orientation=horizontal]:w-full",
					"data-[orientation=vertical]:h-full",
					"data-[orientation=vertical]:w-px",
					className,
				)}
				{...props}
			/>
		);
	}

	return (
		<div
			className={cn(
				"flex items-center text-sm text-muted-foreground",
				orientation === "horizontal" ? "w-full flex-row" : "h-full flex-col",
				className,
			)}
		>
			<BaseSeparator
				orientation={orientation}
				className={cn(
					"bg-border shrink-0",
					orientation === "horizontal" ? "h-px flex-1" : "w-px flex-1",
				)}
			/>

			<span
				className={cn(
					"flex justify-center",
					orientation === "horizontal" ? "px-2" : "py-2",
				)}
			>
				{children}
			</span>

			<BaseSeparator
				orientation={orientation}
				className={cn(
					"bg-border shrink-0",
					orientation === "horizontal" ? "h-px flex-1" : "w-px flex-1",
				)}
			/>
		</div>
	);
}
