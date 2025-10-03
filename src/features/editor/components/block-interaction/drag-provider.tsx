import {
	DndContext,
	type DragEndEvent,
	type DragMoveEvent,
	DragOverlay,
	type DragStartEvent,
} from "@dnd-kit/core";
import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { createEditor, type Editor, Element, Path } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import { renderBlock, renderLeaf } from "@/features/editor/render";
import type { ElementBlock } from "@/features/editor/types/block";
import { useDragBlock } from "../../stores";

interface DragProviderProps {
	children: React.ReactNode;
	editor: Editor;
}

interface ElementSize {
	width: number;
	height: number;
}

/**
 * Cung cấp ngữ cảnh kéo-thả (drag-and-drop) và logic cho các thành phần con sử dụng DndContext.
 *
 * Thành phần này quản lý trạng thái kéo, lấy kích thước phần tử đang kéo,
 * và hiển thị một lớp phủ (overlay) với dữ liệu của block đang được kéo. Tích hợp với store kéo tùy chỉnh
 * để quản lý trạng thái kéo và dữ liệu block.
 *
 * @param {DragProviderProps} props - Props cho component DragProvider.
 * @param {React.ReactNode} props.children - Các thành phần con sẽ có quyền truy cập vào ngữ cảnh kéo-thả.
 *
 * @remarks
 * - Sử dụng `useDragStore` để quản lý trạng thái kéo.
 * - Lấy kích thước phần tử đang kéo để hiển thị overlay phù hợp.
 * - Xử lý sự kiện bắt đầu và kết thúc kéo để cập nhật trạng thái và overlay.
 * - Hiển thị `DragOverlay` với nội dung block đang kéo nếu có.
 *
 * @example
 * ```tsx
 * <DragProvider>
 *   <YourDraggableComponent />
 * </DragProvider>
 * ```
 */
export function DragProvider({ children, editor }: DragProviderProps) {
	const [elementSize, setElementSize] = useState<ElementSize | null>(null);
	const { startDrag, endDrag, dropPosition, setDropTarget, draggedBlockData } =
		useDragBlock();

	/**
	 * Lấy kích thước của block muốn kéo
	 */

	// biome-ignore lint/correctness/useExhaustiveDependencies: Need elementSize for rerender
	const captureElementSize = useCallback(
		(elementId: string) => {
			const element = document.querySelector(`[data-block-id="${elementId}"]`);
			if (element) {
				const rect = element.getBoundingClientRect();
				setElementSize({
					width: rect.width,
					height: rect.height,
				});
			}
		},
		[elementSize],
	);

	/**
	 * Reset lại
	 */
	const resetSize = useCallback(() => {
		setElementSize(null);
	}, []);

	/**
	 * Xử lý việc bắt đầu kéo block
	 */
	const handleDragStart = (event: DragStartEvent) => {
		document.body.classList.add("cursor-grabbing");

		const { active } = event;
		captureElementSize(active.id as string);

		// Lấy data của block được kéo từ active.data.current
		if (active.data.current?.blockData) {
			startDrag(active.id as string, active.data.current.blockData);
		}
	};

	const handleDragMove = (event: DragMoveEvent) => {
		const { over, active } = event;
		const overId = over?.id as string | undefined;
		const activeId = active.id as string;

		if (!overId || overId === activeId) {
			setDropTarget(null, null);
			return;
		}

		// Lấy rect của vùng đang được hover
		const overNodeRect = over?.rect;
		if (!overNodeRect) return;

		// Lấy tọa độ Y của con trỏ từ activatorEvent
		const pointerY = active.rect.current.translated?.top;
		if (!pointerY) return;

		const isTopHalf = pointerY < overNodeRect.top;
		const position = isTopHalf ? "top" : "bottom";

		setDropTarget(overId, position);
	};

	/**
	 * Xử lý việc thả block
	 */
	const handleDragEnd = (event: DragEndEvent) => {
		document.body.classList.remove("cursor-grabbing");
		endDrag();
		resetSize();

		const { active, over } = event;
		if (!active || !over || !active.data.current) return;

		const draggedPath = editor.getBlockPathById(active.id as string);
		let droppedPath = editor.getBlockPathById(over.id as string);

		if (!draggedPath || !droppedPath) return;

		// Mặc định ta sẽ luôn đảm bảo việc thả lên phía lên trên vị trí cần thả
		// để làm được điều đó ta phải đảm bảo rằng: nếu vị trí kéo bé hơn vị trí
		// thả, thì ta lùi vị trí thả lại 1
		if (Path.isBefore(draggedPath, droppedPath)) {
			droppedPath = Path.previous(droppedPath);
		}

		// Nếu vị trí cần thả là nằm ở bên dưới block
		if (dropPosition === "bottom") {
			droppedPath = Path.next(droppedPath);
		}

		// Thực hiện di chuyển node trong editor
		editor.moveNodes({
			at: draggedPath,
			to: droppedPath,
			match: (node) => Element.isElement(node) && node.id === active.id,
		});
	};

	return (
		<DndContext
			onDragStart={handleDragStart}
			onDragMove={handleDragMove}
			onDragEnd={handleDragEnd}
			onDragCancel={endDrag}
		>
			{children}
			{createPortal(
				<DragOverlay dropAnimation={null} adjustScale={false}>
					{draggedBlockData && (
						<div
							className="p-2 opacity-80"
							style={{
								width: elementSize?.width,
								height: elementSize?.height,
							}}
						>
							<DragOverlayContent blockData={draggedBlockData} />
						</div>
					)}
				</DragOverlay>,
				document.body,
			)}
		</DndContext>
	);
}

export function DragOverlayContent({ blockData }: { blockData: ElementBlock }) {
	// Tạo editor tạm thời chỉ để render
	const editor = useMemo(() => withReact(createEditor()), []);

	// Tạo document tạm với block đang kéo
	const document = useMemo(() => {
		return [blockData];
	}, [blockData]);

	return (
		<Slate editor={editor} initialValue={document}>
			<Editable
				readOnly
				renderElement={renderBlock}
				renderLeaf={renderLeaf}
				className="pointer-events-none"
			/>
		</Slate>
	);
}
