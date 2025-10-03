import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { useYjsWorkspace } from "@/features/yjs-workspace";
import type { Workspace } from "@/types";
import { cn } from "@/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

// interface WorkspaceButtonProps {
// 	workspaces: {
// 		name: string;
// 		icon: string;
// 	}[];
// }

export default function WorkspaceButton() {
	const activeWorkspace = useYjsWorkspace((state) => state.activeWorkspace);
	const userWorkspaces = useYjsWorkspace((state) => state.userWorkspaces);
	const connect = useYjsWorkspace((state) => state.connect);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton className="px-1.5 flex justify-between cursor-pointer">
							<div className="flex aspect-square items-center justify-center rounded-md select-none gap-1">
								<span className="text-lg">{activeWorkspace?.icon}</span>
								<span className="truncate font-medium">
									{activeWorkspace?.name}
								</span>
							</div>
							<CaretDownIcon className="opacity-50" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-64 rounded-lg"
						align="start"
						side="bottom"
						sideOffset={4}
					>
						<DropdownMenuLabel className="text-muted-foreground text-xs">
							Workspaces
						</DropdownMenuLabel>
						{userWorkspaces?.map((workspace: Workspace) => (
							<DropdownMenuItem
								key={workspace.id}
								onClick={() => connect(workspace.id)}
								className={cn(
									activeWorkspace.id === workspace.id
										? "bg-primary text-primary-foreground pointer-events-none"
										: "cursor-pointer",
									"gap-2 p-2",
								)}
							>
								<div className="flex size-6 items-center justify-center rounded-xs border bg-stone-100/70">
									{workspace.icon}
								</div>
								{workspace.name}
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem className="gap-2 p-2">
							<div className="bg-background flex size-6 items-center justify-center rounded-md border">
								<PlusIcon className="size-4" />
							</div>
							<div className="text-muted-foreground font-medium">
								Add workspace
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
