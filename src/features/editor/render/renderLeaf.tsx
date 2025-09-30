import type { RenderLeafProps } from "slate-react";
import { cn } from "@/utils";

/**
 * Inline renderer for Slate leaf nodes.
 */
export default function renderLeaf(props: RenderLeafProps) {
	const { text, ...rest } = props.leaf;

	return (
		<span
			{...props.attributes}
			className={cn(
				props.leaf.bold && "font-bold",
				props.leaf.italic && "italic",
				props.leaf.underline && "underline",
				props.leaf.strikeThrough && "line-through",
				props.leaf.code &&
					!props.leaf.codeBlock && [
						"font-mono text-accent-foreground/80 bg-stone-200/60 p-1 rounded text-[90%] z-1",
						"dark:bg-stone-700/70 dark:text-blue-400",
					],
				props.leaf.codeBlock && "token",
				Object.keys(rest).join(" "),
			)}
			spellCheck={props.leaf.code && "false"}
		>
			{props.children}
		</span>
	);
}
