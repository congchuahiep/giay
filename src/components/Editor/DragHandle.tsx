import { cn } from "@/lib/utils";
import { DotsSixVerticalIcon } from "@phosphor-icons/react/dist/csr/DotsSixVertical";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { useState } from "react";
import type { RenderElementProps } from "slate-react";
import { useDraggable } from "@dnd-kit/core";
import { useDragStore } from "@/features/editor/stores";
import { useBlockPath } from "@/hooks/useBlockPath";

interface DragHandleProps {
  isVisible: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  blockPath: string;
  blockData: any;
}

export default function DragHandle({
  onMouseEnter,
  onMouseLeave,
  blockPath,
  blockData,
}: DragHandleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isDragging = useDragStore((state) => state.isDragging);

  const { attributes, listeners, setNodeRef } = useDraggable({
    id: blockPath,
    data: {
      blockData,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "py-1 px-0.5 rounded hover:bg-stone-200 transition-colors duration-150",
        "flex items-center justify-center text-stone-600 hover:text-stone-800",
        "cursor-grab",
        isHovered && "cursor-grab",
        isDragging && "cursor-grabbing"
      )}
      onMouseDown={() => {
        console.log("mở");
      }}
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

function NewParagraph() {
  return (
    <div
      className={cn(
        "py-1 px-0.5 rounded hover:bg-stone-200 transition-colors duration-150",
        "flex items-center cursor-pointer justify-center text-stone-600 hover:text-stone-800"
      )}
    >
      <PlusIcon size={16} weight="light" />
    </div>
  );
}

interface WithBlockInteractioneOptions {
  showOnHover?: boolean;
}

export function withBlockInteraction<P extends RenderElementProps>(
  Component: React.ComponentType<P>,
  options: WithBlockInteractioneOptions = { showOnHover: true }
) {
  return function WrappedComponent(props: P) {
    const [isHovered, setIsHovered] = useState(false);
    const [isDragHandleHovered, setIsDragHandleHovered] = useState(false);

    // Sử dụng Zustand store
    const isDragging = useDragStore((state) => state.isDragging);
    const draggedBlockId = useDragStore((state) => state.draggedBlockPath);

    // Sử dụng hook để tạo unique ID
    const blockPath = useBlockPath(props.element);
    const isCurrentBlockDragged = isDragging && draggedBlockId === blockPath;
    const dragId = blockPath;

    const showBlockInteraction = options.showOnHover
      ? (isHovered || isDragHandleHovered) && !isDragging
      : !isDragging;

    return (
      <div
        className={cn(
          "relative",
          // Làm mờ block đang được kéo
          isCurrentBlockDragged && "text-muted-foreground opacity-40"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-block-id={dragId}
      >
        <div
          className={cn(
            "absolute left-0 top-0 items-start justify-center flex",
            "w-6 -ml-9 opacity-0 transition-opacity duration-150",
            showBlockInteraction && "opacity-100"
          )}
        >
          <NewParagraph />
          <DragHandle
            isVisible={showBlockInteraction}
            onMouseEnter={() => setIsDragHandleHovered(true)}
            onMouseLeave={() => setIsDragHandleHovered(false)}
            blockPath={blockPath}
            blockData={props.element}
          />
        </div>

        <Component {...props} />
      </div>
    );
  };
}
