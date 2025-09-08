import type { SafeMenuPlacement } from "@/types";

export interface SlashMenuState {
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
