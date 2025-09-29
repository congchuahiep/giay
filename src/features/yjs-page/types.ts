import type { HocuspocusProvider } from "@hocuspocus/provider";
import type { PagePreview, YjsConnectStatus } from "@/types";

export interface YjsPageProps {
	/**
	 * Dữ liệu trang tài liệu:
	 * - **`title`**: `Y.XmlText` - Tiêu đề của trang.
	 * - **`icon`**: `Y.Text` - Icon của trang.
	 * - **`content`**: `Y.XmlText` - Nội dung của trang.
	 *
	 * @example Cách lấy dữ liệu từ yDoc
	 * ```tsx
	 * const { yDoc } = useYjsDocumentContext();
	 * const title = yDoc.get("title", Y.XmlText);
	 * const icon = yDoc.get("icon", Y.Text);
	 * const content = yDoc.get("content", Y.XmlText);
	 * ```
	 */
	provider: HocuspocusProvider;
	currentPage: PagePreview;
	status: YjsConnectStatus;
}

export interface YjsPageState extends YjsPageProps {}
