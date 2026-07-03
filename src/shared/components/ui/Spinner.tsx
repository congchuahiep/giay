import { IconLoader4 } from "@tabler/icons-react";
import { cn } from "tailwind-variants";

export default function Spinner({
	className,
	description,
	...props
}: React.ComponentProps<"svg"> & {
	description?: string;
}) {
	return (
		<>
			<IconLoader4
				role="status"
				aria-label={description ?? "Loading"}
				className={cn("size-4 animate-spin duration-100", className)}
				{...props}
			/>
			{description}
		</>
	);
}
