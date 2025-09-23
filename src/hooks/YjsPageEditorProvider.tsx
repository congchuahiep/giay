import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import useInternetConnect from "./useInternetConnect";
import { HocuspocusProvider } from "@hocuspocus/provider";
import type { PagePreview } from "@/types";

interface YjsPageEditor {
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
	activePage: PagePreview;
	status: EditorStatus;
}

const YjsPageEditorContext = createContext<YjsPageEditor | undefined>(
	undefined,
);

export const useYjsPageEditorContext = () => {
	const ctx = useContext(YjsPageEditorContext);
	if (!ctx)
		throw new Error(
			"useYjsDocumentContext must be used within YjsDocumentProvider",
		);
	return ctx;
};

export const YjsPageEditorProvider = ({
	websocketUrl,
	activePage,
	yDoc,
	children,
}: {
	websocketUrl: string;
	activePage: PagePreview;
	yDoc: Y.Doc;
	children: React.ReactNode;
}) => {
	const [status, setStatus] = useState<EditorStatus>("initial");

	const provider = useMemo(() => {
		const provider = new HocuspocusProvider({
			url: websocketUrl,
			name: activePage.id,
			document: yDoc,
		});

		return provider;
	}, [websocketUrl, activePage.id, yDoc]);

	// Huỷ kết nối khi đổi trang
	useEffect(() => {
		// console.log("Connecting to provider: ", provider.document.clientID);
		setStatus("connecting");
		provider.connect();

		const onSynced = () => {
			setStatus("connected");
		};
		const onDisconnected = () => {
			setStatus("offline");
		};

		provider.on("synced", onSynced);
		provider.on("disconnected", onDisconnected);

		return () => {
			// console.log("Disconnecting from provider: ", provider.document.clientID);
			provider.off("synced", onSynced);
			provider.off("disconnected", onDisconnected);
			provider.destroy();
		};
	}, [provider]);

	useEffect(() => {
		console.info("YJS PAGE EDITOR STATUS: ", status);
	}, [status]);

	return (
		<YjsPageEditorContext.Provider
			value={{ provider, activePage: activePage, status }}
		>
			{status !== "initial" && children}
		</YjsPageEditorContext.Provider>
	);
};

export type EditorStatus =
	| "initial"
	| "connecting"
	| "connected"
	| "offline"
	| "saving";
