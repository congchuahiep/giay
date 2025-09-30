import type { HocuspocusProvider } from "@hocuspocus/provider";
import type { Workspace, YjsConnectStatus } from "@/types";

/**
 * Interface mô tả các props liên quan đến workspace Yjs.
 * Được sử dụng để truyền dữ liệu và các hàm điều khiển workspace hiện tại,
 * danh sách workspace của người dùng, trạng thái kết nối và provider Yjs.
 */
export interface YjsWorkspaceProps {
	/**
	 * Workspace hiện đang được chọn/hoạt động.
	 */
	activeWorkspace: Workspace;

	/**
	 * Danh sách tất cả workspace mà người dùng sở hữu hoặc có quyền truy cập.
	 */
	userWorkspaces: Workspace[];

	/**
	 * Hàm dùng để thay đổi workspace đang hoạt động.
	 * @param workspace - Workspace mới sẽ được chọn.
	 */
	setActiveWorkspace: (workspace: Workspace) => void;

	/**
	 * Đối tượng HocuspocusProvider dùng để kết nối tới server Yjs.
	 */
	provider: HocuspocusProvider;

	/**
	 * Trạng thái kết nối hiện tại với server Yjs.
	 * - "connecting": Đang kết nối
	 * - "connected": Đã kết nối thành công
	 * - "error": Có lỗi xảy ra
	 * - "disconnected": Đã ngắt kết nối
	 */
	status: YjsConnectStatus;
}

export interface YjsWorkspaceState extends YjsWorkspaceProps {
	/**
	 * Kết nối workspace
	 */
	connect: (workspaceId: string) => void;
}
