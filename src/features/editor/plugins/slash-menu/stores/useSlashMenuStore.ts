import { create } from "zustand";
import type { SafeMenuPlacement } from "@/types";
import type { SlashMenuState } from "@/features/editor/plugins/slash-menu/types/SlashMenuState";
import type { SlashMenuActions } from "@/features/editor/plugins/slash-menu/types/SlashMenuActions";

/**
 * Store dùng để quản lý trạng thái và thao tác với Slash Menu.
 *
 * Store này cung cấp các actions để mở, đóng, cập nhật vị trí và chỉ mục được chọn của menu slash.
 * Logic mở slash menu chưa được xử lý vị trí hiển thị, chỉ tập trung vào việc quản lý trạng thái.
 */
export const useSlashMenuStore = create<SlashMenuState & SlashMenuActions>(
  (set, get) => ({
    // Initial state
    isOpen: false,
    displayPosition: null,
    selectedIndex: 0,
    anchorOffset: 0,
    searchQuery: "",

    // Actions
    open: (position?: SafeMenuPlacement, anchorOffset?: number) => {
      set({
        isOpen: true,
        displayPosition: position || null,
        selectedIndex: 0,
        anchorOffset: anchorOffset || 0,
        searchQuery: "",
      });
    },

    close: () => {
      set({
        isOpen: false,
        displayPosition: null,
        selectedIndex: 0,
        anchorOffset: 0,
        searchQuery: "",
      });
    },

    updateSearchQuery: (query: string) => {
      if (get().isOpen) {
        set({
          searchQuery: query,
          selectedIndex: 0, // Reset về item đầu tiên
        });
      }
    },

    setSelectedIndex: (index: number) => {
      if (get().isOpen) {
        set({
          selectedIndex: index,
        });
      }
    },

    reset: () => {
      set({
        isOpen: false,
        displayPosition: null,
        selectedIndex: 0,
        anchorOffset: 0,
        searchQuery: "",
      });
    },
  })
);