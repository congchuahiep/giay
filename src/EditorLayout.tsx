import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import DebugMenu from "@/components/Titlebar/DebugMenu";
import Titlebar from "@/components/Titlebar/Titlebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { ShortcutListener } from "@/core/shortcut/components/ShortcutListener";
import { useSettingsStore } from "@/features/user-settings/stores/useSettingsStore";
import { YjsWorkspaceProvider } from "@/features/yjs-workspace";
import { useWorkspacesQuery } from "./services/workspaces";
import { useAuthStore } from "./stores/auth";
import type { Workspace } from "./types";
import CreateWorkspaceDialog from "./windows/CreateWorkspaceDialog";

export default function EditorLayout() {
	const { init } = useSettingsStore(); // Khởi tạo settings store ngay khi app load
	const { token } = useAuthStore();
	const { data: workspaces, isLoading, isError } = useWorkspacesQuery(token);
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

	if (isError) {
		return <div>Error...</div>;
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
		<YjsWorkspaceProvider>
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
