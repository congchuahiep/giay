import { Transforms } from "slate";
import {
	ReactEditor,
	type RenderElementProps,
	useSelected,
	useSlateStatic,
} from "slate-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils";

const DividerBlock = (props: RenderElementProps) => {
	const editor = useSlateStatic();
	const isSelected = useSelected();

	const handleClick = () => {
		const path = ReactEditor.findPath(editor, props.element);
		Transforms.select(editor, path);
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Divider is a static element and can be interacted with using keyboard
		<div
			{...props.attributes}
			className={cn(
				"flex items-center cursor-pointer px-1 py-2 outline-none select-none",
				isSelected && "bg-primary/30 rounded-sm",
			)}
			contentEditable={false}
			onKeyUp={handleClick}
		>
			{/* Hidden children để Slate vẫn có thể track */}
			<span className="hidden select-none">{props.children}</span>
			{/* Divider line */}
			<Separator />
		</div>
	);
};

export default DividerBlock;
