import { useEffect } from "react";
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
import { useAuthStore } from "@/stores/auth";

export default function EditorLayout() {
	const { init } = useSetting(); // Khởi tạo settings store ngay khi app load
	const { token } = useAuthStore();

	useEffect(() => {
		init();
	}, [init]);

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
