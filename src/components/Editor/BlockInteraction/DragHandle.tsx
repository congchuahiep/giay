import { cn } from "@/utils";
import { DotsSixVerticalIcon } from "@phosphor-icons/react/dist/csr/DotsSixVertical";
import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useDragStore } from "@/features/editor/stores";
import { CSS } from "@dnd-kit/utilities";

interface DragHandleProps {
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	blockData: any;
}

export default function DragHandle({
	onMouseEnter,
	onMouseLeave,
	blockData,
}: DragHandleProps) {
	const [isHovered, setIsHovered] = useState(false);
	const isDragging = useDragStore((state) => state.isDragging);

	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: blockData.id,
		data: { blockData },
	});

	const style = {
		transform: CSS.Translate.toString(transform),
	};

	return (
		<div
			ref={setNodeRef}
			className={cn(
				"py-1 px-1 rounded transition-colors duration-150",
				"flex items-center justify-center",
				"text-stone-600 dark:text-stone-100  hover:text-stone-800 dark:hover:text-stone-300",
				"hover:bg-stone-200 dark:hover:bg-stone-800",
				"cursor-grab touch-none",
				isHovered && "cursor-grab",
				isDragging && "cursor-grabbing",
			)}
			style={style}
			onMouseEnter={() => {
				setIsHovered(true);
				onMouseEnter?.();
			}}
			onMouseLeave={() => {
				setIsHovered(false);
				onMouseLeave?.();
			}}
			{...attributes}
			{...listeners}
		>
			<DotsSixVerticalIcon size={16} weight="bold" />
		</div>
	);
}
