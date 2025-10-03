import { Home, Search, Settings } from "lucide-react";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { openSettingsWindow } from "@/features/windows-navigates";
import { PageExplorer } from "./page-explorer";
import WorkspaceButton from "./workspace-button";

// Menu items.
const useAppsidebarItems = (navigate: NavigateFunction) => [
	{
		title: "Home",
		url: "#",
		icon: Home,
		onClick: () => navigate("/"),
	},
	{
		title: "Search",
		url: "#",
		icon: Search,
	},
	{
		title: "Settings",
		url: "#",
		icon: Settings,
		onClick: openSettingsWindow,
	},
];

export default function AppSidebar() {
	const navigate = useNavigate();
	const sidebarItems = useAppsidebarItems(navigate);

	return (
		<Sidebar className="pt-12" variant="inset">
			<SidebarHeader>
				<WorkspaceButton />
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="dark:text-stone-300">
						Application
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{sidebarItems.map((item) => (
								<SidebarMenuItem key={item.title} onClick={item.onClick}>
									<SidebarMenuButton
										asChild
										className="dark:text-stone-100 dark:hover:bg-stone-700/50 active:text-stone-400"
									>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroupContent>
					<PageExplorer />
				</SidebarGroupContent>
			</SidebarContent>
		</Sidebar>
	);
}
