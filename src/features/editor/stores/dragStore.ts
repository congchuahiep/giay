import type { ClientRect } from "@dnd-kit/core";
import type { Element } from "slate";
import { create } from "zustand";

interface DragState {
  isDragging: boolean;
  draggedBlockId: string | null;
  draggedBlockData: Element | null;
  overBlockId: string | null;
  overBlockRect: {} | null;
  dropPosition: "top" | "bottom" | null;

  // Actions
  startDrag: (blockId: string, blockData: Element) => void;
  setDropTarget: (
    overId: string | null,
    overBlockRect: ClientRect | null,
    position: "top" | "bottom" | null
  ) => void;
  endDrag: () => void;
  resetDrag: () => void;
}

const useDragStore = create<DragState>((set) => ({
  isDragging: false,
  draggedBlockId: null,
  draggedBlockData: null,
  overBlockId: null,
  overBlockRect: null,
  dropPosition: null,

  startDrag: (blockId: string, blockData: Element) =>
    set({
      isDragging: true,
      draggedBlockId: blockId,
      draggedBlockData: blockData,
    }),

  endDrag: () =>
    set({
      isDragging: false,
      draggedBlockId: null,
      draggedBlockData: null,
    }),

  setDropTarget: (overId, overBlockRect, position) =>
    set({
      overBlockId: overId,
      overBlockRect: overBlockRect,
      dropPosition: position,
    }),

  resetDrag: () =>
    set({
      isDragging: false,
      draggedBlockId: null,
      draggedBlockData: null,
    }),
}));

export default useDragStore;
