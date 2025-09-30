import { isTauri } from "@tauri-apps/api/core";
import { useEffect, useRef } from "react";
import type { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { savePageContentToSQLite } from "@/services/documentStorage";
import type { EditorStatus } from "./useYjsDocument";

export function useYjsSync(
	pageId: string,
	yDoc: Y.Doc,
	provider: WebsocketProvider | undefined,
	isConnected: boolean,
	setStatus: (status: EditorStatus) => void,
) {
	// Sử dụng ref để luôn có giá trị mới nhất của isConnected trong callbacks
	const isConnectedRef = useRef(isConnected);

	useEffect(() => {
		isConnectedRef.current = isConnected;
	}, [isConnected]);

	// Sync/cập nhập dữ liệu khi có một người đang chỉnh sửa nội dung
	useEffect(() => {
		if (!provider || !yDoc) return;

		const handleSync = (isSynced: boolean) => {
			if (isSynced) {
				setStatus("saving");
				savePageContentToSQLite(pageId, yDoc).finally(() => {
					setStatus(isConnectedRef.current ? "connected" : "offline");
				});
			}
		};

		provider.on("sync", handleSync);

		return () => {
			provider.off("sync", handleSync);
		};
	}, [provider, yDoc, pageId, setStatus]);

	// Lưu document xuống SQLite định kỳ khi người dùng chỉnh sửa
	useEffect(() => {
		if (!yDoc) return;
		if (!isTauri()) return;

		const pageContentData = yDoc.get("content", Y.XmlText);

		const observer = () => {
			console.log(yDoc.get("title", Y.XmlText).toString());
			setStatus("saving");
			savePageContentToSQLite(pageId, yDoc).finally(() => {
				setStatus(isConnectedRef.current ? "connected" : "offline");
			});
		};

		pageContentData.observeDeep(observer);

		return () => {
			pageContentData.unobserveDeep(observer);
		};
	}, [yDoc, pageId, setStatus]);
}
