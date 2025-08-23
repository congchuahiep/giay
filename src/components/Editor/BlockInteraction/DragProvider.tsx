import { useDragStore } from "@/features/editor/stores";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent
} from "@dnd-kit/core";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
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
  const { startDrag, endDrag, setDropTarget, draggedBlockData } =
    useDragStore();

  // Thiết lập sensor để lấy được tọa độ con trỏ chính xác
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Yêu cầu di chuyển 8px để bắt đầu drag
      },
    })
  );

  /**
   * Lấy kích thước của block muốn kéo
   */
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
    [elementSize]
  );

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

  const handleDragMove = (event: DragMoveEvent) => {
    const { over, active } = event;
    const overId = over?.id as string | undefined;
    const activeId = active.id as string;

    if (!overId || overId === activeId) {
      setDropTarget(null, null, null);
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

    setDropTarget(overId, null, position);
  };

  /**
   * Xử lý việc thả block
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // TODO: Xử lý việc thả block
    console.log("Drag ended:", {
      activeId: active.id,
      overId: over?.id,
      activeData: active.data.current,
      overData: over?.data.current,
    });

    endDrag();
    resetSize();
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      // onDragOver={handleDragOver}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={endDrag}
    >
      {children}
      {createPortal(
        <DragOverlay dropAnimation={null}>
          {draggedBlockData && (
            <div
              className="p-2 opacity-80"
              style={{
                width: elementSize?.width,
                height: elementSize?.height,
              }}
            >
              <div className="text-gray-600">
                {Node.string(draggedBlockData)}
              </div>
            </div>
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
