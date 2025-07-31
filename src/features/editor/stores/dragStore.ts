import type { Element } from "slate";
import { create } from "zustand";

interface DragState {
  isDragging: boolean;
  draggedBlockPath: string | null;
  draggedBlockData: Element | null;

  // Actions
  startDrag: (blockId: string, blockData: Element) => void;
  endDrag: () => void;
  resetDrag: () => void;
}

const useDragStore = create<DragState>((set) => ({
  isDragging: false,
  draggedBlockPath: null,
  draggedBlockData: null,

  startDrag: (blockId: string, blockData: Element) =>
    set({
      isDragging: true,
      draggedBlockPath: blockId,
      draggedBlockData: blockData,
    }),

  endDrag: () =>
    set({
      isDragging: false,
      draggedBlockPath: null,
      draggedBlockData: null,
    }),

  resetDrag: () =>
    set({
      isDragging: false,
      draggedBlockPath: null,
      draggedBlockData: null,
    }),
}));

export default useDragStore;
