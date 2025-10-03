import type { KeyboardEvent } from "react";

export interface SelectEditor {
	/**
	 * Mở rộng selection hiện tại trong Slate editor để selection bao trọn các block element đầy đủ
	 *
	 * - Nếu selection đã bao trọn toàn bộ các block, hàm sẽ bỏ chọn (clear selection)
	 * - Nếu selection nằm trong một block duy nhất, hàm sẽ mở rộng selection để chọn toàn bộ block đó
	 * - Nếu selection trải dài nhiều block, hàm sẽ mở rộng selection để chọn từ đầu block đầu tiên đến cuối block cuối cùng
	 *
	 * @param editor - Đối tượng Slate editor.
	 * @param event - Sự kiện bàn phím kích hoạt việc mở rộng vùng chọn. Hàm sẽ ngăn hành động mặc định của sự kiện này
	 */
	expandSelectionToFullBlocks: (event: KeyboardEvent) => void;

	/**
	 * Kiểm tra xem có đang select toàn bộ block không
	 * @returns {boolean} True nếu đang select toàn bộ block
	 * @example
	 * if (editor.isSelectingFullBlock()) {
	 *   // Thực hiện action khi select toàn bộ block
	 * }
	 */
	isSelectFullBlock: () => boolean;

	isSelectAllBlock: () => boolean;
}
