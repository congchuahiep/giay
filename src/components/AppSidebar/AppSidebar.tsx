import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { QuestionIcon } from "@phosphor-icons/react/dist/csr/Question";
import { Home, Search, Settings } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { openSettingsWindow } from "@/features/navigates";
import { cn } from "@/utils";
import WorkspaceButton from "./WorkspaceButton";
import PageExplorer from "./PageExplorer";
import { useYjsWorkspaceContext } from "@/contexts/useYjsWorkspaceContext";
import { useNavigate, type NavigateFunction } from "react-router-dom";

// Menu items.
const useAppsidebarItems = (navigate: NavigateFunction) => [
	{
		title: "Home",
		url: "#",
		icon: Home,
		onClick: () => {
			// Navigate đến trang mới
			navigate("/");
		},
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

const footerItemClass = "dark:text-stone-100";

const footerItems = [
	{
		title: "Help",
		icon: <QuestionIcon className={footerItemClass} />,
	},
	{
		title: "Settings",
		icon: <GearIcon className={footerItemClass} />,
		onClick: openSettingsWindow,
	},
];

const AppSidebar = () => {
	const navigate = useNavigate();

	const { activeWorkspace } = useYjsWorkspaceContext();
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
					<PageExplorer workspaceId={activeWorkspace.id} />
				</SidebarGroupContent>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem className="flex justify-end gap-2">
						{footerItems.map((item) => (
							<SidebarMenuButton
								key={item.title}
								asChild
								onClick={item.onClick}
								tooltip={"123"}
								className={cn(
									"p-2 text-stone-500 hover:bg-stone-700/50 rounded-md cursor-pointer",
								)}
							>
								{item.icon}
							</SidebarMenuButton>
						))}
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSidebar;
