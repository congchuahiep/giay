import type { Position } from "@/types";

export interface MenuDimensions {
  width: number;
  height: number;
}

/**
 * Vị trí an toàn cho khi mở menu
 * - `position`: Tọa độ x, y để đặt menu
 * - `placement`: Vị trí tương đối so với con trỏ (dưới hoặc trên)
 * - `dimensions`: Kích thước thực tế của menu
 */
export interface SafeMenuPlacement {
  position: Position;
  placement: "bottom" | "top";
  dimensions: MenuDimensions;
}
