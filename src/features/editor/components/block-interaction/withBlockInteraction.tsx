import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import type { RenderElementProps } from "slate-react";
import { cn } from "@/utils";
import { useDragBlock } from "../../stores";
import {
	DragHandle,
	DropIndicator,
	NewParagraphButton,
} from "../block-interaction";

interface WithBlockInteractionOptions {
	/**
	 * Block Interaction sẽ được căn giữa với chính giữa block
	 */
	alignCenter?: boolean;
}

/**
 * Higher-Order Component (HOC) bổ sung tính năng tương tác cho block trong Slate.
 *
 * Tính năng bao gồm:
 * - Drag handle, cho phép block có khả năng kéo thả
 * - Nút tạo paragraph mới
 *
 * @template P - Kiểu props mở rộng từ `RenderElementProps`
 * @param Component - React component sẽ được wrap
 * @param options - Các tùy chọn cấu hình
 * @returns Component mới với các tính năng tương tác block
 */
export function withBlockInteraction<P extends RenderElementProps>(
	Component: React.ComponentType<P>,
	options: WithBlockInteractionOptions = {},
) {
	const { alignCenter = false } = options;

	return function BlockInteractionWrapper(props: P) {
		const [isHovered, setIsHovered] = useState(false);
		const [isDragHandleHovered, setIsDragHandleHovered] = useState(false);

		// Zustand store state
		const { isDragging, draggedBlockId, overBlockId, dropPosition } =
			useDragBlock();

		// Block đang được drag là block hiện tại?
		const isCurrentBlockDragged =
			isDragging && draggedBlockId === props.element.id;

		// Thiết lập Droppable
		const { setNodeRef: setDroppableRef } = useDroppable({
			id: props.element.id,
			data: { blockData: props.element },
		});

		// Xác định xem có nên hiển thị drop indicator hay không
		const shouldShowIndicator =
			isDragging && overBlockId === props.element.id && !isCurrentBlockDragged;

		// Hiển thị interaction UI khi hover và không đang drag
		const showBlockInteraction =
			(isHovered || isDragHandleHovered) && !isDragging;

		return (
			<div
				ref={setDroppableRef}
				className={cn(
					"relative",
					// Visual feedback khi block đang được kéo
					isCurrentBlockDragged && "text-muted-foreground opacity-40",
				)}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				data-block-id={props.element.id}
			>
				{/* Drop indicators */}
				{shouldShowIndicator && (
					<DropIndicator isTop={dropPosition === "top"} />
				)}

				{/* Block interaction controls */}
				<div
					className={cn(
						"absolute left-0 flex justify-center select-none",
						"w-6 -ml-10 opacity-0 transition-opacity duration-150 z-10",
						showBlockInteraction && "opacity-100",
						// Positioning based on alignment option
						alignCenter ? "top-0 bottom-0" : "top-1",
					)}
					onMouseDown={(e: React.MouseEvent) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					<NewParagraphButton blockId={props.element.id} />
					<DragHandle
						onMouseEnter={() => setIsDragHandleHovered(true)}
						onMouseLeave={() => setIsDragHandleHovered(false)}
						blockData={props.element}
					/>
				</div>

				{/* Original component */}
				<Component {...props} />
			</div>
		);
	};
}

export default withBlockInteraction;
