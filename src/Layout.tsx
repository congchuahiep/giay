import { useEffect } from "react";
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

export default function Layout({ children }: { children: React.ReactNode }) {
	const { init } = useSettingsStore(); // Khởi tạo settings store ngay khi app load

	useEffect(() => {
		init();
	}, [init]);

	return (
		<ThemeProvider storageKey="theme">
			<ShortcutListener />
			<SidebarProvider>
				<Titlebar>
					<SidebarTrigger className="cursor-pointer" />
					<DebugMenu />
				</Titlebar>
				<AppSidebar />
				<SidebarInset>{children}</SidebarInset>
			</SidebarProvider>
		</ThemeProvider>
	);
}
