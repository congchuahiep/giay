import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as Y from "yjs";
import useInternetConnect from "./useInternetConnect";
import { HocuspocusProvider } from "@hocuspocus/provider";

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
	pageId: string;
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
	pageId,
	yDoc,
	children,
}: {
	websocketUrl: string;
	pageId: string;
	yDoc: Y.Doc;
	children: React.ReactNode;
}) => {
	const [status, setStatus] = useState<EditorStatus>("initial");

	const provider = useMemo(() => {
		const provider = new HocuspocusProvider({
			url: websocketUrl,
			name: pageId,
			document: yDoc,

			onSynced() {
				setStatus("connected");
			},

			onDisconnect: () => {
				setStatus("offline");
			},
		});

		return provider;
	}, [websocketUrl, pageId, yDoc]);

	// Huỷ kết nối khi đổi trang
	useEffect(() => {
		console.log("Connecting to provider: ", provider.document.clientID);
		setStatus("connecting");
		provider.connect();
		return () => {
			console.log("Disconnecting from provider: ", provider.document.clientID);
			setStatus("initial");
			provider.disconnect();
		};
	}, [provider]);

	return (
		<YjsPageEditorContext.Provider value={{ provider, pageId, status }}>
			{children}
		</YjsPageEditorContext.Provider>
	);
};

export type EditorStatus =
	| "initial"
	| "connecting"
	| "connected"
	| "offline"
	| "saving";
