import { slateNodesToInsertDelta } from "@slate-yjs/core";
import { isTauri } from "@tauri-apps/api/core";
import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { loadPageFromSQLite } from "@/services/documentStorage";
import useOnlineStatus from "./useOnlineStatus";

interface YjsDocument {
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
	yDoc: Y.Doc;
	provider?: WebsocketProvider;
	status: EditorStatus;
	setStatus: (status: EditorStatus) => void;
	isConnected: boolean;
}

const YjsDocumentContext = createContext<YjsDocument | undefined>(undefined);

export const useYjsDocumentContext = () => {
	const ctx = useContext(YjsDocumentContext);
	if (!ctx)
		throw new Error(
			"useYjsDocumentContext must be used within YjsDocumentProvider",
		);
	return ctx;
};

export const YjsDocumentProvider = ({
	websocketUrl,
	pageId,
	children,
}: {
	websocketUrl: string;
	pageId: string;
	children: React.ReactNode;
}) => {
	const value = useYjsDocument(websocketUrl, pageId);

	if (!value.yDoc) {
		return (
			<div className="flex justify-center items-center h-screen">
				Loading...
			</div>
		);
	}

	return (
		<YjsDocumentContext.Provider value={{ ...value, yDoc: value.yDoc }}>
			{children}
		</YjsDocumentContext.Provider>
	);
};

export type EditorStatus =
	| "initial"
	| "connecting"
	| "connected"
	| "offline"
	| "saving";

/**
 * useYjsDocument là một custom React hook dùng để khởi tạo và quản lý tài liệu
 * Yjs cho một trang, hỗ trợ đồng bộ hóa dữ liệu theo thời gian thực qua
 * WebSocket, cũng như chế độ offline.
 *
 * Hook này sẽ:
 * - Tự động tải tài liệu từ SQLite nếu đang chạy trong môi trường Tauri,
 *   hoặc tạo mới nếu chưa có.
 * - Khởi tạo các trường dữ liệu Yjs cho tiêu đề, icon và nội dung trang.
 * - Kết nối tới WebSocket provider để đồng bộ hóa tài liệu khi có mạng.
 * - Theo dõi trạng thái kết nối mạng và trạng thái kết nối WebSocket.
 * - Cung cấp các state và phương thức cần thiết để sử dụng trong editor.
 *
 * @param websocketUrl Địa chỉ WebSocket server để đồng bộ hóa tài liệu.
 * @param pageId   ID của tài liệu cần khởi tạo hoặc kết nối.
 * @returns            Các state và phương thức liên quan đến tài liệu Yjs và trạng thái kết nối.
 */
function useYjsDocument(websocketUrl: string, pageId: string) {
	// Trạng thái kết nối mạng
	const isOnline = useOnlineStatus();
	// Trạng thái kết nối với websocket
	const [isConnected, setIsConnected] = useState(false);
	// Trạng thái của editor hiện tại
	const [status, setStatus] = useState<EditorStatus>("initial");

	// Tài liệu Yjs
	const [yDoc, setYDoc] = useState<Y.Doc | null>(null);
	const [provider, setProvider] = useState<WebsocketProvider | undefined>(
		undefined,
	);

	// Khởi tạo document
	// biome-ignore lint/correctness/useExhaustiveDependencies: Không cần thiết
	useEffect(() => {
		async function initDocument() {
			try {
				setStatus("initial");

				// Thử load document từ SQLite (chỉ load khi sử dụng ứng dụng Tauri)
				let doc = isTauri() ? await loadPageFromSQLite(pageId) : null;

				// Nếu không tìm thấy, tạo document mới
				if (!doc) {
					doc = new Y.Doc();
				}

				// Nếu không có kết nối mạng => offline
				if (!isOnline) {
					setStatus("offline");
					return;
				}

				// Nếu có kết nối mạng, tiến hành kết nối với websocket provider
				setStatus("connecting");
				const websocketProvider = new WebsocketProvider(
					websocketUrl,
					pageId,
					doc,
				);

				setYDoc(doc);

				// Lắng nghe sự kiện kết nối
				websocketProvider.on("status", (event) => {
					setIsConnected(event.status === "connected");
					setStatus(event.status === "connected" ? "connected" : "offline");
				});

				setProvider(websocketProvider);
			} catch (error) {
				console.error("Error initializing document:", error);
				setStatus("offline");
			}
		}

		initDocument();

		return () => {
			provider?.disconnect();
			provider?.destroy();
			yDoc?.destroy();
		};
	}, [pageId, isOnline]);

	// Xử lý trạng thái online/offline
	useEffect(() => {
		if (!provider || !yDoc) return;

		if (isOnline) {
			setStatus("connecting");
			provider.connect();
		} else {
			setStatus("offline");
			provider.disconnect();
		}
	}, [isOnline, provider, yDoc]);

	return {
		yDoc,
		provider,
		status,
		setStatus,
		isConnected,
	};
}

// /**
//  * Khởi tạo dữ liệu mặc định cho trang mới
//  *
//  * @param pageTitleYDoc
//  * @param pageContentYDoc
//  */
// function initialPageData(pageTitleYDoc: Y.XmlText, pageContentYDoc: Y.XmlText) {
// 	console.log("initialPageData", pageTitleYDoc, pageContentYDoc);

// 	if (pageTitleYDoc.length === 0) {
// 		console.log("pageTitleYDoc is empty");
// 		pageTitleYDoc.applyDelta(
// 			slateNodesToInsertDelta([
// 				{ id: uuidv4(), type: "paragraph", children: [{ text: "" }] },
// 			]),
// 		);
// 	}

// 	if (pageContentYDoc.length === 0) {
// 		console.log("pageContentYDoc is empty");
// 		pageContentYDoc.applyDelta(
// 			slateNodesToInsertDelta([
// 				{ id: uuidv4(), type: "paragraph", children: [{ text: "" }] },
// 			]),
// 		);
// 	}
// }
