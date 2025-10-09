import type { HocuspocusProvider } from "@hocuspocus/provider";
import { isTauri } from "@tauri-apps/api/core";
import { debounce } from "lodash";
import { useEffect } from "react";
import * as Y from "yjs";
import { usePageContentLocalSave } from "@/services/pages";

/**
 * Hook này dùng để theo dõi sự thay đổi nội dung của trang tài liệu và lưu nó
 * vào trong database phía local
 *
 * @param provider
 * @remarks Hook này chỉ hỗ trợ trong ứng dụng desktop (tauri)
 */
export default function useYjsPageLocalSave(
	pageId: string,
	workspaceId: string,
	provider: HocuspocusProvider | null,
) {
	const { mutate: savePageContent } = usePageContentLocalSave();

	useEffect(() => {
		if (!isTauri()) return;
		if (!provider) return;

		const pageYDoc = provider.document;
		const pageContentShared = pageYDoc.get("content", Y.XmlText);

		const observerPage = debounce(() => {
			savePageContent({ pageId, workspaceId, pageData: pageYDoc });
		}, 2000);

		pageContentShared.observeDeep(observerPage);

		return () => {
			pageContentShared.unobserveDeep(observerPage);
		};
	}, [provider, savePageContent, pageId, workspaceId]);
}
