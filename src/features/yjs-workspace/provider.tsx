import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import { useWorkspacesQuery } from "@/services/workspaces";
import { useAuthStore } from "@/stores/auth";
import type { Workspace, YjsConnectStatus } from "@/types";
import { YjsWorkspaceContext } from "./context";
import { createYjsWorkspaceStore } from "./store";

const YJS_WORKSPACE_URL = import.meta.env.VITE_YJS_WORKSPACE_SERVER;

/**
 * React Provider component chịu trách nhiệm khởi tạo và cung cấp Zustand store
 * cho toàn bộ ứng dụng liên quan đến Yjs workspace.
 *
 * - Sử dụng `useWorkspacesQuery` để fetch danh sách workspace của người dùng.
 * - Hiển thị fallback UI trong các trạng thái:
 *   - Loading: hiển thị "Loading..."
 *   - Error: hiển thị thông báo lỗi
 *   - Không có workspace: hiển thị "You have no workspace"
 * - Khi có dữ liệu hợp lệ, khởi tạo `HocuspocusProvider` và inject vào store.
 * - Store được truyền xuống qua `YjsContext.Provider` để các component con
 *   có thể truy cập thông qua custom hook `useYjsWorkspace`.
 *
 * @param children - React node sẽ được render bên trong provider.
 *
 * @example
 * ```tsx
 * <YjsWorkspaceProvider>
 *   <App />
 * </YjsWorkspaceProvider>
 * ```
 *
 * Trong component con:
 * ```tsx
 * const activeWorkspace = useYjsWorkspace((s) => s.activeWorkspace);
 * ```
 */
export const YjsWorkspaceProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { token } = useAuthStore();
	const {
		data: workspaces,
		isLoading,
		isError,
		error,
	} = useWorkspacesQuery(token);
	const [status, setStatus] = useState<YjsConnectStatus>("connecting");

	const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
	const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
		null,
	);

	useEffect(() => {
		if (!workspaces) return;
		setActiveWorkspace(workspaces[0]);
	}, [workspaces]);

	useEffect(() => {
		if (!activeWorkspace) return;

		setStatus("connecting");
		const provider = new HocuspocusProvider({
			url: YJS_WORKSPACE_URL,
			name: activeWorkspace.id,
		});

		provider.on("synced", () => {
			setStatus("connected");
		});

		provider.on("disconnect", () => {
			setStatus("disconnected");
		});

		setProvider(provider);

		return () => {
			setStatus("disconnected");
			provider.removeAllListeners();
			provider.disconnect();
		};
	}, [activeWorkspace]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	if (!workspaces || !provider || !activeWorkspace) {
		return <div>You have no workspace</div>;
	}

	return (
		<YjsWorkspaceContext.Provider
			value={createYjsWorkspaceStore({
				userWorkspaces: workspaces,
				activeWorkspace: activeWorkspace,
				setActiveWorkspace: setActiveWorkspace,
				provider,
				status,
			})}
		>
			{children}
		</YjsWorkspaceContext.Provider>
	);
};
