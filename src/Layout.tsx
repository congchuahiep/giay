import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import DebugMenu from "@/components/Titlebar/DebugMenu";
import Titlebar from "@/components/Titlebar/Titlebar";
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
import { useAuthStore } from "./stores/auth";
import CreateWorkspaceDialog from "./windows/CreateWorkspaceDialog";
import { useQueryClient } from "@tanstack/react-query";

const YJS_WORKSPACE_URL = import.meta.env.VITE_YJS_WORKSPACE_SERVER;

export default function Layout() {
	const { init } = useSettingsStore(); // Khởi tạo settings store ngay khi app load
	const { token } = useAuthStore();
	const { data: workspaces, isLoading } = useWorkspacesQuery(token);
	const queryClient = useQueryClient();

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
		return (
			<CreateWorkspaceDialog
				open={true}
				onCreated={() => {
					queryClient.invalidateQueries(["workspaces"]);
				}}
			/>
		);
	}

	return (
		<YjsWorkspaceProvider
			websocketUrl={YJS_WORKSPACE_URL}
			workspace={activeWorkspace}
			userWorkspaces={workspaces}
		>
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
		</YjsWorkspaceProvider>
	);
}
