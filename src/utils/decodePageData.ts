import * as Y from "yjs";

/**
 * Decode page_data từ server response thành Y.Doc
 *
 * Thường được sử dụng khi lấy dữ liệu từ server hoặc từ local storage
 * và muốn chuyển đổi thành Y.Doc để sử dụng trong ứng dụng.
 */
export default function decodePageData(
	rawPageData: Uint8Array | string | number[],
): Y.Doc {
	try {
		const ydoc = new Y.Doc();
		let bytes: Uint8Array;

		// Xử lý các format khác nhau từ server (tương tự documentStorage.ts)
		if (typeof rawPageData === "string") {
			// Nếu là chuỗi JSON
			bytes = new Uint8Array(JSON.parse(rawPageData));
		} else if (Array.isArray(rawPageData)) {
			// Nếu là mảng số
			bytes = new Uint8Array(rawPageData);
		} else if (rawPageData instanceof Uint8Array) {
			// Nếu đã là Uint8Array
			bytes = rawPageData;
		} else {
			console.warn("Unknown type for page_data, creating empty Y.Doc");
			return ydoc; // Trả về empty Y.Doc
		}

		// Apply update để khôi phục Y.Doc từ binary data
		Y.applyUpdate(ydoc, bytes);
		console.log("Successfully decoded Y.Doc from server data");

		return ydoc;
	} catch (error) {
		console.error("Error decoding page_data:", error);
		// Trả về empty Y.Doc thay vì throw error
		return new Y.Doc();
	}
}
