import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import DebugMenu from "@/components/Tauri/DebugMenu";
import Titlebar from "@/components/Tauri/Titlebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ShortcutListener } from "@/core/shortcut/components/ShortcutListener";
import { useSettingsStore } from "@/features/user-settings/stores/useSettingsStore";
import YjsWorkspaceProvider from "./providers/YjsWorkspaceProvider";
import { useWorkspacesQuery } from "./services/workspaces";
import type { Workspace } from "./types";
import { Outlet } from "react-router-dom";

const YJS_WORKSPACE_URL = import.meta.env.VITE_YJS_WORKSPACE_SERVER;

export default function Layout() {
	const { init } = useSettingsStore(); // Khởi tạo settings store ngay khi app load

	const { data: workspaces, isLoading } = useWorkspacesQuery();

	const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(
		null,
	);

	useEffect(() => {
		init();
	}, [init]);

	useEffect(() => {
		if (workspaces && workspaces.length > 0) {
			setActiveWorkspace(workspaces[0]);
		}
	}, [workspaces]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!workspaces || !activeWorkspace) {
		return <div>No active workspace</div>; // TODO: Xử lý việc tạo workspace mới
	}

	return (
		<YjsWorkspaceProvider
			websocketUrl={YJS_WORKSPACE_URL}
			workspace={activeWorkspace}
			userWorkspaces={workspaces}
		>
			<ThemeProvider storageKey="theme">
				<ShortcutListener />
				<SidebarProvider>
					<Titlebar>
						<SidebarTrigger className="cursor-pointer" />
						<DebugMenu />
					</Titlebar>
					<AppSidebar />
					<SidebarInset>
						<Outlet />
					</SidebarInset>
				</SidebarProvider>
			</ThemeProvider>
		</YjsWorkspaceProvider>
	);
}
