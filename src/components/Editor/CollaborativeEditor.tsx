// Import các custom hooks mới

import { useEffect } from "react";
import PageEditor from "@/components/Editor/PageEditor";
import {
	useYjsPageEditorContext,
	YjsPageEditorProvider,
} from "@/hooks/YjsPageEditorProvider";
import { usePageQuery } from "@/services/pages";
import { Skeleton } from "../ui/skeleton";

const YJS_PAGE_URL = import.meta.env.VITE_YJS_PAGE_SERVER;

interface CollaborativeEditorProps {
	pageId: string;
}

/**
 * Khởi động Editor bao gồm các tính năng cộng tác
 */
const CollaborativeEditor = ({ pageId }: CollaborativeEditorProps) => {
	const { data: pageData, isFetching, isError } = usePageQuery(pageId);

	if (isFetching) return <EditorLoading />;

	if (isError) return <div>Internal server error</div>;

	if (!pageData) return <div>Page not found</div>;

	return (
		<YjsPageEditorProvider
			websocketUrl={YJS_PAGE_URL}
			activePage={{ ...pageData, children: [] }}
			yDoc={pageData.page_data}
		>
			<div className="h-screen flex flex-col">
				<PageEditor />
			</div>
		</YjsPageEditorProvider>
	);
};

function EditorLoading() {
	return (
		<div className="flex flex-col gap-2 mt-20">
			<Skeleton className="w-full h-[120px]" />
			<Skeleton className="w-full h-[24px] opacity-80" />
			<Skeleton className="w-full h-[24px] opacity-60" />
			<Skeleton className="w-full h-[24px] opacity-40" />
			<Skeleton className="w-full h-[24px] opacity-20" />
			<Skeleton className="w-full h-[24px] opacity-5" />
		</div>
	);
}

export default CollaborativeEditor;
