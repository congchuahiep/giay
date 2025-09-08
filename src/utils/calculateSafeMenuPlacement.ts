import type { SafeMenuPlacement } from "@/types";

/**
 * Tính toán vị trí an toàn cho menu để tránh đụng vào các cạnh màn hình
 * @param cursorRect - Kích thước và vị trí con trỏ (cursor) hiện tại
 * @param menuRect - Kích thước của menu (nếu đã render)
 * @param offset - Khoảng cách giữa cursor và menu
 *
 * @returns {SafeMenuPlacement} Vị trí an toàn cho menu
 */
export default function calculateSafeMenuPlacement(
  cursorRect: DOMRect,
  menuRect: DOMRect | null,
  offset: number = 4
): SafeMenuPlacement {
  // Kích thước viewport
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Kích thước mặc định của menu (fallback)
  const defaultMenuWidth = 256; // w-64 = 16rem = 256px
  const defaultMenuHeight = 320; // h-80 = 20rem = 320px

  let menuWidth = defaultMenuWidth;
  let menuHeight = defaultMenuHeight;

  // Lấy kích thước thực tế của menu nếu có thể
  menuWidth = menuRect?.width || defaultMenuWidth;
  menuHeight = menuRect?.height || defaultMenuHeight;

  // Tính toán các vị trí có thể
  const positions = {
    bottom: {
      x: cursorRect.x,
      y: cursorRect.y + offset + cursorRect.height,
    },
    top: {
      x: cursorRect.x,
      // y: cursorPosition.y + offset,
      y: cursorRect.y - menuHeight - offset,
    },
  };

  // Ưu tiên bottom trước -> top
  const priorityOrder: Array<keyof typeof positions> = ["bottom", "top"];

  for (const placement of priorityOrder) {
    const pos = positions[placement];

    // Kiểm tra xem vị trí này có nằm trong viewport không
    const isInViewport = pos.y >= 0 && pos.y + menuHeight <= viewportHeight;

    if (pos.x + menuWidth > viewportWidth - 10) {
      pos.x = viewportWidth - menuWidth - 10; // Chỉnh về bên phải
    }

    if (isInViewport) {
      return {
        position: { x: pos.x, y: pos.y },
        placement: placement,
        dimensions: { width: menuWidth, height: menuHeight },
      };
    }
  }

  return {
    position: {
      x: cursorRect.x,
      y: cursorRect.y + offset,
    },
    placement: "bottom",
    dimensions: {
      width: menuWidth,
      height: viewportHeight - cursorRect.y,
    },
  };
}
