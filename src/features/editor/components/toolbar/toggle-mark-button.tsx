import type { JSX } from "react";
import { useSlateSelector, useSlateStatic } from "slate-react";
import { Button } from "@/components/ui/button";
import type { MarkType } from "@/features/editor/types";
import { cn } from "@/utils";

const ToggleMarkButton = ({
	icon,
	format,
}: {
	icon: JSX.Element;
	format: MarkType;
}) => {
	const editor = useSlateStatic();
	const isActive = useSlateSelector((editor) => editor.isMarkActive(format));

	const handleMouseDown = (event: React.MouseEvent) => {
		event.preventDefault();
		editor.toggleMark(format);
	};

	return (
		<Button
			variant="ghost"
			size="icon"
			className={cn(
				"size-8 cursor-pointer",
				isActive &&
					"text-accent-foreground hover:text-shadow-accent-foreground",
			)}
			onMouseDown={handleMouseDown}
		>
			{icon}
		</Button>
	);
};

export default ToggleMarkButton;
