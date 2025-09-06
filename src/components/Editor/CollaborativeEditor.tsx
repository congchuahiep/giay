// Import các custom hooks mới
import PageEditor from "@/components/Editor/Editor";
import { useYjsDocument, type EditorStatus } from "@/hooks/useYjsDocument";
import { useYjsSync } from "@/hooks/useYjsSync";

// Các import khác...

// Chuyển các hằng số cấu hình vào file riêng hoặc biến môi trường
const WEBSOCKET_URL = "ws://localhost:1234";
const DOCUMENT_ID = "slate-demo-room";

/**
 * Khởi động Editor bao gồm các tính năng cộng tác
 */
const CollaborativeEditor = () => {
  // Khởi tạo Yjs
  const { yDoc, sharedType, provider, status, setStatus, isConnected } =
    useYjsDocument(WEBSOCKET_URL, DOCUMENT_ID);

  // Kích hoạt đồng bộ hóa dữ liệu
  useYjsSync(DOCUMENT_ID, yDoc, sharedType, provider, isConnected, setStatus);

  // Hiển thị trạng thái loading
  if (status === "initial" || !sharedType || !yDoc) {
    return <div className="p-4">Loading document...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
        <h1 className="text-lg font-medium">Slate Editor</h1>
        <StatusIndicator status={status} />
      </div>

      <PageEditor sharedType={sharedType} provider={provider} />
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
