import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import type { MouseEvent } from "react";
import { Path } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";
import { cn } from "@/utils";

interface NewParagraphButtonProps {
	blockId: string;
}

export default function NewParagraphButton({
	blockId,
}: NewParagraphButtonProps) {
	const editor = useSlateStatic();

	const handleClick = (event: MouseEvent) => {
		try {
			event.preventDefault();
			// Convert string path back to Path array
			const blockPath = editor.getBlockPathById(blockId);
			if (!blockPath) return;

			// Insert new paragraph after current block
			const newPath = Path.next(blockPath);
			const newBlock = editor.buildBlock();

			editor.insertBlock(newBlock, { at: newPath });

			// Focus on new paragraph
			editor.select(newPath);
			ReactEditor.focus(editor);
		} catch (error) {
			console.error("Error inserting new paragraph:", error);
		}
	};

	return (
		<div
			className={cn(
				"py-1 px-1 rounded transition-colors duration-150",
				"flex items-center cursor-pointer justify-center",
				"text-stone-600 dark:text-stone-100  hover:text-stone-800 dark:hover:text-stone-300",
				"hover:bg-stone-200 dark:hover:bg-stone-800",
			)}
			onClickCapture={handleClick}
		>
			<PlusIcon size={16} weight="light" />
		</div>
	);
}
