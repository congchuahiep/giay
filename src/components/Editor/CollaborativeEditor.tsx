// Import các custom hooks mới
import PageEditor from "@/components/Editor/PageEditor";
import { YjsPageEditorProvider } from "@/hooks/YjsPageEditorProvider";
import { usePageQuery } from "@/services/pages";

const YJS_PAGE_URL = import.meta.env.VITE_YJS_PAGE_SERVER;

interface CollaborativeEditorProps {
	pageId: string;
}

/**
 * Khởi động Editor bao gồm các tính năng cộng tác
 */
const CollaborativeEditor = ({ pageId }: CollaborativeEditorProps) => {
	const { data: pageData, isLoading } = usePageQuery(pageId);

	if (isLoading) return <div>Loading...</div>;

	if (!pageData) return <div>Page not found</div>;

	return (
		<YjsPageEditorProvider
			websocketUrl={YJS_PAGE_URL}
			pageId={pageId}
			yDoc={pageData.page_data}
		>
			<div className="h-screen flex flex-col">
				<PageEditor />
			</div>
		</YjsPageEditorProvider>
	);
};

// // Component hiển thị trạng thái
// const StatusIndicator = ({ status }: { status: EditorStatus }) => {
// 	const getStatusColor = () => {
// 		switch (status) {
// 			case "connected":
// 				return "bg-green-500";
// 			case "connecting":
// 				return "bg-yellow-500";
// 			case "saving":
// 				return "bg-blue-500";
// 			case "offline":
// 				return "bg-red-500";
// 			default:
// 				return "bg-gray-500";
// 		}
// 	};

// 	const getStatusLabel = () => {
// 		switch (status) {
// 			case "connected":
// 				return "Online";
// 			case "connecting":
// 				return "Connecting...";
// 			case "offline":
// 				return "Offline";
// 			case "saving":
// 				return "Saving...";
// 			default:
// 				return "Unknown";
// 		}
// 	};

// 	return (
// 		<div className={`px-2 py-1 text-xs rounded text-white ${getStatusColor()}`}>
// 			{getStatusLabel()}
// 		</div>
// 	);
// };

export default CollaborativeEditor;
