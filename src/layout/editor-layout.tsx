import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTitle, Titlebar } from "@/components/titlebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { ShortcutListener } from "@/features/shortcut/";
import { useSetting } from "@/features/user-settings";
import { YjsWorkspaceProvider } from "@/features/yjs-workspace";
import { useWorkspacesQuery } from "@/services/workspaces";
import { useAuthStore } from "@/stores/auth";
import type { Workspace } from "@/types";
import CreateWorkspaceDialog from "@/windows/create-workspace-dialog";

export default function EditorLayout() {
	const { init } = useSetting(); // Khởi tạo settings store ngay khi app load
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
					<AppTitle />
				</Titlebar>
				<AppSidebar />
				<SidebarInset>
					<Outlet />
				</SidebarInset>
			</SidebarProvider>
		</YjsWorkspaceProvider>
	);
}
