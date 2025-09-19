// Import các custom hooks mới
import PageEditor from "@/components/Editor/PageEditor";
import {
	useYjsDocumentContext,
	type EditorStatus,
} from "@/hooks/useYjsDocument";
import { useYjsSync } from "@/hooks/useYjsSync";

// Các import khác...

// Chuyển các hằng số cấu hình vào file riêng hoặc biến môi trường
interface CollaborativeEditorProps {
	pageId: string;
}

/**
 * Khởi động Editor bao gồm các tính năng cộng tác
 */
const CollaborativeEditor = ({ pageId }: CollaborativeEditorProps) => {
	// Khởi tạo Yjs
	const { yDoc, provider, status, setStatus, isConnected } =
		useYjsDocumentContext();

	// Kích hoạt đồng bộ hóa dữ liệu
	useYjsSync(pageId, yDoc, provider, isConnected, setStatus);

	// Hiển thị trạng thái loading
	if (status === "initial" || !yDoc) {
		return <div className="p-4">Loading document...</div>;
	}

	return (
		<div className="h-screen flex flex-col">
			<div className="fixed right-4 top-14 p-2">
				<StatusIndicator status={status} />
			</div>
			<PageEditor />
		</div>
	);
};

// Component hiển thị trạng thái
const StatusIndicator = ({ status }: { status: EditorStatus }) => {
	const getStatusColor = () => {
		switch (status) {
			case "connected":
				return "bg-green-500";
			case "connecting":
				return "bg-yellow-500";
			case "saving":
				return "bg-blue-500";
			case "offline":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	const getStatusLabel = () => {
		switch (status) {
			case "connected":
				return "Online";
			case "connecting":
				return "Connecting...";
			case "offline":
				return "Offline";
			case "saving":
				return "Saving...";
			default:
				return "Unknown";
		}
	};

	return (
		<div className={`px-2 py-1 text-xs rounded text-white ${getStatusColor()}`}>
			{getStatusLabel()}
		</div>
	);
};

export default CollaborativeEditor;
