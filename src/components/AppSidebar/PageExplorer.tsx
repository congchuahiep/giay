import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { DotsThreeIcon } from "@phosphor-icons/react/dist/csr/DotsThree";
import { FileIcon } from "@phosphor-icons/react/dist/csr/File";
import { LinkIcon } from "@phosphor-icons/react/dist/csr/Link";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Y from "yjs";
import { useYjsWorkspaceContext } from "@/contexts/useYjsWorkspaceContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePageCreate, usePageDelete } from "@/services/pages/";
import type { PagePreview } from "@/types/Page";
import { cn } from "@/utils";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton,
} from "../ui/sidebar";

interface PageExplorerProps {
	workspaceId: string;
}

export default function PageExplorer({ workspaceId }: PageExplorerProps) {
	const { provider, activeWorkspace } = useYjsWorkspaceContext();
	const navigate = useNavigate();

	const { mutate: createPage } = usePageCreate(workspaceId, {
		onSuccess: (newPage) => {
			const yDocRoot = provider.document;
			yDocRoot.getMap<PagePreview>("root-pages").set(newPage.id, newPage);
			navigate(`/${workspaceId}/${newPage.id}`);
		},
	});

	const [pages, setPages] = useState<Record<string, PagePreview>>({});
	const [isLoading, setIsLoading] = useState(true);

	//
	// CÁC EFFECT
	//

	// biome-ignore lint/correctness/useExhaustiveDependencies: 123
	useEffect(() => {
		const rootPages = provider.document.getMap("root-pages");
		setPages(rootPages.toJSON());

		// Chờ provider đồng bộ
		const handleSynced = () => {
			setIsLoading(false);
		};

		// Lắng nghe thay đổi trong array
		const handlePagesChange = () => {
			setPages(rootPages.toJSON());
		};

		rootPages.observe(handlePagesChange);
		provider.on("synced", handleSynced);

		return () => {
			rootPages.unobserve(handlePagesChange);
			provider.off("synced", handleSynced);
		};
	}, [activeWorkspace]);

	//
	// CÁC EVENT
	//

	const handleCreateNewPage = async () => {
		try {
			createPage({ parentPageId: undefined });
		} catch (error) {
			console.error("Error creating new page:", error);
		}
	};

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel className={cn("dark:text-stone-300d")}>
				Pages
			</SidebarGroupLabel>
			<SidebarGroupAction
				className={cn(
					"py-0 flex items-center hover:bg-stone-300/50 rounded-md",
					"cursor-pointer opacity-0 group-hover:opacity-100 bg-transparent",
				)}
				onClick={handleCreateNewPage}
			>
				<PlusIcon className="w-4 h-4" />
			</SidebarGroupAction>
			{isLoading ? (
				<SidebarGroup>
					<SidebarMenu>
						{Array.from({ length: 8 }, (_, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Static element
							<SidebarMenuItem key={index}>
								<SidebarMenuSkeleton />
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			) : pages && Object.keys(pages).length !== 0 ? (
				<SidebarMenu>
					{Object.entries(pages)
						.sort((a, b) => a[1].title.localeCompare(b[1].title))
						.map(([id, item]) => (
							<PageItem key={id} pageId={id} pageData={item} />
						))}
				</SidebarMenu>
			) : (
				<SidebarGroupLabel>
					<div className={cn("text-center w-full pt-4")}>
						Oops! Looks like you don't have <br /> any pages. Create a new one?
					</div>
				</SidebarGroupLabel>
			)}
		</SidebarGroup>
	);
}

// <SidebarMenuItem>
// 	<SidebarMenuButton className="text-sidebar-foreground/70">
// 		<DotsThreeIcon />
// 		<span>More</span>
// 	</SidebarMenuButton>
// </SidebarMenuItem>;

interface PageItemProps {
	pageId: string;
	pageData: PagePreview;
}

function PageItem({ pageId, pageData }: PageItemProps) {
	const navigate = useNavigate();

	const { pageId: currentPageId } = useParams();
	const { activeWorkspace } = useYjsWorkspaceContext();

	const handlePageClick = (pageId: string) => {
		navigate(`/${activeWorkspace.id}/${pageId}`);
	};

	return (
		<SidebarMenuItem
			data-page-id={pageId}
			onClick={() => handlePageClick(pageId)}
		>
			<SidebarMenuButton
				title={pageData.title}
				isActive={pageId === currentPageId}
			>
				<span>
					{pageData.icon ? (
						pageData.icon
					) : (
						<FileIcon weight="duotone" size={16} width={20} />
					)}
				</span>
				<span className={cn(!pageData.title && "text-neutral-500")}>
					{pageData.title ? pageData.title : "Untitled"}
				</span>
			</SidebarMenuButton>
			<PageItemAction pageData={pageData} />
		</SidebarMenuItem>
	);
}

interface PageItemActionProps {
	pageData: PagePreview;
}

function PageItemAction({ pageData }: PageItemActionProps) {
	const isMobile = useIsMobile();
	const navigate = useNavigate();
	const { pageId: currentPageId } = useParams();
	const { provider } = useYjsWorkspaceContext();

	const { mutate: handleDeletePage } = usePageDelete({
		onSuccess: (deletedPageId) => {
			const yDocRoot = provider.document;
			yDocRoot.getMap<PagePreview>("root-pages").delete(deletedPageId);
			if (deletedPageId === currentPageId) {
				navigate("/");
			}
		},
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuAction showOnHover>
					<DotsThreeIcon />
					<span className="sr-only">More</span>
				</SidebarMenuAction>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-56 rounded-lg"
				side={isMobile ? "bottom" : "right"}
				align={isMobile ? "end" : "start"}
			>
				<DropdownMenuItem>
					<LinkIcon className="text-muted-foreground" />
					<span>Copy Link</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<ArrowUpRightIcon className="text-muted-foreground" />
					<span>Open in New Tab</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation();
						handleDeletePage({ id: pageData.id });
					}}
				>
					<TrashIcon className="text-muted-foreground" />
					<span>Delete</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
