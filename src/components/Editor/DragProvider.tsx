import { useDragStore } from "@/features/editor/stores";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useCallback, useState } from "react";
import { Node } from "slate";

interface DragProviderProps {
  children: React.ReactNode;
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
export function DragProvider({ children }: DragProviderProps) {
  const [elementSize, setElementSize] = useState<ElementSize | null>(null);
  const { startDrag, endDrag, draggedBlockData } = useDragStore();

  /**
   * Lấy kích thước của block muốn kéo
   */
  const captureElementSize = useCallback((elementId: string) => {
    const element = document.querySelector(`[data-block-id="${elementId}"]`);
    if (element) {
      const rect = element.getBoundingClientRect();
      setElementSize({
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  /**
   
   */
  const resetSize = useCallback(() => {
    setElementSize(null);
  }, []);

  /**
   * Xử lý việc bắt đầu kéo block
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    captureElementSize(active.id as string);

    // Lấy data của block được kéo từ active.data.current
    if (active.data.current?.blockData) {
      startDrag(active.id as string, active.data.current.blockData);
    }
  };

  /**
   * Xử lý việc thả block
   */
  const handleDragEnd = (event: DragEndEvent) => {
    // TODO: Xử lý logic drop ở đây sau
    console.log("Drag ended:", event);

    endDrag();
    resetSize();
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {children}
      <DragOverlay dropAnimation={null}>
        {draggedBlockData && (
          <div
            className="p-2 opacity-80"
            style={{
              width: elementSize?.width,
              height: elementSize?.height,
            }}
          >
            <div className="text-gray-600">{Node.string(draggedBlockData)}</div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
