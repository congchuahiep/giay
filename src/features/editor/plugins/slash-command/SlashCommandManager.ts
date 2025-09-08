import { create } from "zustand";
import type { SafeMenuPlacement } from "@/types";

/**
 * Kiểu định nghĩa hàm lắng nghe sự kiện của Slash Command Manager
 */
type SlashCommandListener = (state: SlashMenuState) => void;

interface SlashMenuState {
  // Slash Menu có đang mở hay không
  isOpen: boolean;
  // Vị trí hiển thị menu (tọa độ x, y) hoặc null nếu không xác định
  displayPosition: SafeMenuPlacement | null;
  // Chỉ số mục đang được chọn trong menu
  selectedIndex: number;
  // Vị trí anchor (sau ký tự "/") để theo dõi giá trị `searchQuery`
  anchorOffset: number;
  // Đoạn chuỗi thông tin dùng để lọc slash command item
  searchQuery: string;
}

/**
 * Các hành động (actions) mà SlashCommandManager có thể thực hiện
 */
type SlashMenuActions = {
  /**
   * Mở slash command menu
   */
  open: (position?: SafeMenuPlacement, anchorOffset?: number) => void;

  /**
   * Đóng slash command menu
   */
  close: () => void;

  /**
   * Cập nhật search query và reset selected index
   */
  updateSearchQuery: (query: string) => void;

  /**
   * Cập nhật selected index
   */
  setSelectedIndex: (index: number) => void;

  /**
   * Reset về trạng thái ban đầu
   */
  reset: () => void;
};

/**
 * Store dùng để quản lý trạng thái và thao tác với Slash Command Menu.
 *
 * Store này cung cấp các actions để mở, đóng, cập nhật vị trí và chỉ mục được chọn của menu slash.
 */
export const useSlashCommandStore = create<SlashMenuState & SlashMenuActions>(
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

/**
 * Quản lý trạng thái và sự kiện của Slash Command Menu trong trình soạn thảo.
 *
 * Lớp này cung cấp các phương thức để mở, đóng, cập nhật vị trí và chỉ mục được chọn của menu slash,
 * cũng như cho phép component khác đăng ký lắng nghe sự thay đổi trạng thái của menu.
 *
 * - Cho phép đăng ký và huỷ đăng ký các listener để nhận thông báo khi trạng thái menu thay đổi.
 * - Hỗ trợ mở/đóng menu tại vị trí xác định.
 * - Cung cấp phương thức để cập nhật chỉ mục mục được chọn trong menu.
 * - Hỗ trợ kiểm tra trạng thái mở/đóng của menu.
 * - Cung cấp phương thức reset để dọn dẹp trạng thái và listener.
 */
// class SlashCommandManager {
//   private state: SlashMenuState = {
//     isOpen: false,
//     displayPosition: null,
//     selectedIndex: 0,
//     anchorOffset: 0,
//     searchQuery: "",
//   };

//   // Component đã đăng ký theo dõi sự kiện
//   private listener: SlashCommandListener = () => {};

//   /**
//    * Cho phép component được phép đăng ký để theo dõi sự kiện của Slash Command,
//    * phương thức này nhận vào một call back có chứa một tham số là `state`. cho
//    * phép sử dụng nó để theo dõi trạng thái hiện tại của Slash command
//    *
//    * Việc đăng ký sự kiện này cho phép mỗi khi `state` của `SlashCommandManager`
//    * được cập nhật, component đang theo dõi cũng được thông báo và cập nhật được
//    * `state` mới
//    *
//    * @returns Một hàm callback dùng để huỷ đăng ký theo dõi sự kiện
//    */
//   subscribe(callback: SlashCommandListener): () => void {
//     this.listener = callback;

//     // Immediately call with current state
//     callback(this.state);

//     // Return unsubscribe function
//     return () => {
//       this.listener = () => {};
//     };
//   }

//   /**
//    * Lấy state của slash command hiện tại
//    */
//   getState(): SlashMenuState {
//     return { ...this.state };
//   }

//   /**
//    * Mở slash command
//    */
//   open(position?: SafeMenuPlacement, anchorOffset?: number): void {
//     this.updateState({
//       isOpen: true,
//       displayPosition: position || null,
//       selectedIndex: 0,
//       anchorOffset: anchorOffset || 0,
//       searchQuery: "",
//     });
//   }

//   /**
//    * Đóng slash command
//    */
//   close(): void {
//     this.updateState({
//       isOpen: false,
//       displayPosition: null,
//       selectedIndex: 0,
//       anchorOffset: 0,
//       searchQuery: "",
//     });
//   }

//   /**
//    * Kiểm tra menu có đang mở hay không
//    */
//   isMenuOpen(): boolean {
//     return this.state.isOpen;
//   }

//   /**
//    * Cập nhật search query và reset selected index
//    */
//   updateSearchQuery(query: string): void {
//     if (this.state.isOpen) {
//       this.updateState({
//         ...this.state,
//         searchQuery: query,
//         selectedIndex: 0, // Reset về item đầu tiên
//       });
//     }
//   }

//   /**
//    * Cập nhật selected index
//    */
//   setSelectedIndex(index: number): void {
//     if (this.state.isOpen) {
//       this.updateState({
//         ...this.state,
//         selectedIndex: index,
//       });
//     }
//   }

//   /**
//    * Cập nhật trạng thái hiện tại của Slash Command và thông báo cho tất cả các
//    * listener đã đăng ký.
//    *
//    * @param newState Trạng thái mới sẽ được áp dụng cho Slash Command.
//    * Sau khi cập nhật, tất cả các listener sẽ được gọi với trạng thái mới này.
//    */
//   private updateState(newState: SlashMenuState): void {
//     this.state = newState;
//     this.invokeListeners();
//   }

//   /**
//    * Thông báo các listener đã đăng ký với trạng thái hiện tại.
//    *
//    * Phương thức này sẽ truyền cho listener trạng thái hiện tại của menu. Việc
//    * này giúp listerner theo dõi được state hiện tại cỉa Slash Command
//    *
//    * @private
//    */
//   private invokeListeners(): void {
//     this.listener(this.state);
//   }

//   /**
//    * Khôi phục SlashCommandManager (hữu dụng khi dọn)
//    */
//   reset(): void {
//     this.state = {
//       isOpen: false,
//       displayPosition: null,
//       selectedIndex: 0,
//       anchorOffset: 0,
//       searchQuery: "",
//     };
//     this.listener = () => {};
//   }
// }

// // Create singleton instance
// const slashMenuManager = new SlashCommandManager();

// export default slashMenuManager;
export type { SlashMenuState, SlashCommandListener };
