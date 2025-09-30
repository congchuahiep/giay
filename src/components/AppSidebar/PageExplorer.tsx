import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { FileIcon } from "@phosphor-icons/react/dist/csr/File";
import { LinkIcon } from "@phosphor-icons/react/dist/csr/Link";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import { SpinnerIcon } from "@phosphor-icons/react/dist/csr/Spinner";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	usePageChildrenQuery,
	usePageCreate,
	usePageDelete,
} from "@/services/pages/";
import type { PagePreview } from "@/types/Page";
import { cn } from "@/utils";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "../ui/context-menu";
import {
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton,
	SidebarMenuSub,
} from "../ui/sidebar";
import { useYjsWorkspace } from "@/features/yjs-workspace";

// interface PageExplorerProps {
// 	workspaceId: string;
// }

export default function PageExplorer() {
	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel className={cn("dark:text-stone-300d")}>
				Pages
			</SidebarGroupLabel>
			<PageCreateButton />
			<PageList />
		</SidebarGroup>
	);
}

function PageCreateButton() {
	const activeWorkspace = useYjsWorkspace((state) => state.activeWorkspace);
	const provider = useYjsWorkspace((state) => state.provider);
	const navigate = useNavigate();

	const { mutate: createPage } = usePageCreate(activeWorkspace.id, {
		onSuccess: (newPage) => {
			const yDocRoot = provider.document;
			yDocRoot.getMap<PagePreview>("root-pages").set(newPage.id, newPage);
			navigate(`/${activeWorkspace.id}/${newPage.id}`);
		},
	});

	const handleCreateNewPage = async () => {
		try {
			createPage({ parentPageId: undefined });
		} catch (error) {
			console.error("Error creating new page:", error);
		}
	};

	return (
		<SidebarGroupAction
			className={cn(
				"py-0 flex items-center hover:bg-stone-300/50 rounded-md",
				"cursor-pointer opacity-0 group-hover:opacity-100 bg-transparent",
			)}
			onClick={handleCreateNewPage}
		>
			<PlusIcon className="w-4 h-4" />
		</SidebarGroupAction>
	);
}

function PageList() {
	const provider = useYjsWorkspace((state) => state.provider);
	const status = useYjsWorkspace((state) => state.status);
	const [pages, setPages] = useState<Record<string, PagePreview>>({});

	useEffect(() => {
		const rootPages = provider.document.getMap("root-pages");
		setPages(rootPages.toJSON());

		// Lắng nghe thay đổi trong array
		const handlePagesChange = () => {
			setPages(rootPages.toJSON());
		};

		rootPages.observe(handlePagesChange);

		return () => {
			rootPages.unobserve(handlePagesChange);
		};
	}, [provider]);

	return status === "connecting" ? (
		Array.from({ length: 8 }, (_, index) => (
			// biome-ignore lint/suspicious/noArrayIndexKey: Static element
			<SidebarMenuItem key={index}>
				<SidebarMenuSkeleton />
			</SidebarMenuItem>
		))
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
	);
}

interface PageItemProps {
	pageId: string;
	pageData: PagePreview;
}

function PageItem({ pageId, pageData }: PageItemProps) {
	const navigate = useNavigate();
	const [isHovered, setIsHovered] = useState(false);
	const [isCollapseOpen, setIsCollapseOpen] = useState(false);

	const { pageId: currentPageId } = useParams();
	const activeWorkspace = useYjsWorkspace((state) => state.activeWorkspace);
	const provider = useYjsWorkspace((state) => state.provider);

	const {
		data: pageChildrenData,
		refetch: fetchPageChildren,
		isFetching,
	} = usePageChildrenQuery(pageId, {
		enabled: currentPageId === pageId,
		initialData: [],
	});
	const [pageChildren, setPageChildren] = useState<PagePreview[]>([]);

	const handlePageExplanation = useCallback(async () => {
		await fetchPageChildren();

		const pageChildrenShared = provider.document.getMap<PagePreview>(pageId);

		pageChildrenData?.forEach((child) => {
			pageChildrenShared.set(child.id, child);
		});
	}, [fetchPageChildren, pageChildrenData, pageId, provider]);

	const handlePageClick = useCallback(
		async (e: React.MouseEvent, pageId: string) => {
			e.stopPropagation();
			navigate(`/${activeWorkspace.id}/${pageId}`);
			setIsCollapseOpen(true);
		},
		[navigate, activeWorkspace.id],
	);

	// TODO: Triển khai việc tự mở vị trí hiện tại của trang khi mới truy cập
	// useEffect(() => {
	// 	if (currentPageId === pageId)
	// 		handlePageExplanation().then(() => {
	// 			setIsOpenCollapsed(true);
	// 		});
	// }, [currentPageId, pageId, handlePageExplanation]);

	useEffect(() => {
		if (isCollapseOpen) {
			handlePageExplanation();
		}
	}, [isCollapseOpen, handlePageExplanation]);

	useEffect(() => {
		const pageChildrenShared = provider.document.getMap<PagePreview>(pageId);

		const handlePageChildrenChange = () => {
			setPageChildren(Object.values(pageChildrenShared.toJSON()));
		};
		pageChildrenShared.observe(handlePageChildrenChange);

		return () => {
			pageChildrenShared.unobserve(handlePageChildrenChange);
		};
	}, [provider, pageId]);

	return (
		<PageItemAction pageData={pageData}>
			<SidebarMenuItem
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				data-page-id={pageId}
				onClick={(e) => handlePageClick(e, pageId)}
			>
				<SidebarMenuButton
					title={pageData.title}
					isActive={pageId === currentPageId}
					className={cn(isFetching && "animate-pulse")}
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
				<Collapsible
					open={isCollapseOpen}
					onOpenChange={() => setIsCollapseOpen(!isCollapseOpen)}
					className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
				>
					<CollapsibleTrigger asChild>
						<SidebarMenuAction
							onClick={(e) => {
								e.stopPropagation();
							}}
							className={cn(
								isHovered ? "visible" : "invisible",
								"cursor-pointer",
							)}
						>
							{isFetching ? (
								<SpinnerIcon
									size={16}
									// TODO: Làm cho cái spinner xoay tròn
									className="ml-2 transition-all rotate-180 duration-300 repeat-infinite"
								/>
							) : (
								<CaretDownIcon className="transition-transform" />
							)}
						</SidebarMenuAction>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarMenuSub>
							{Array.isArray(pageChildren) &&
								pageChildren
									?.sort((a, b) => a.title.localeCompare(b.title))
									.map((subItem) => (
										<PageItem
											key={subItem.id}
											pageId={subItem.id}
											pageData={subItem}
										/>
									))}
						</SidebarMenuSub>
					</CollapsibleContent>
				</Collapsible>
			</SidebarMenuItem>
		</PageItemAction>
	);
}

interface PageItemActionProps {
	pageData: PagePreview;
	children: React.ReactNode;
}

function PageItemAction({ pageData, children }: PageItemActionProps) {
	const { pageId: currentPageId } = useParams();

	const navigate = useNavigate();
	const provider = useYjsWorkspace((state) => state.provider);

	const { mutate: handleDeletePage } = usePageDelete({
		onSuccess: (deletedPageId) => {
			const yDocRoot = provider.document;
			yDocRoot
				.getMap<PagePreview>(
					pageData.parent_page_id ? pageData.parent_page_id : "root-pages",
				)
				.delete(deletedPageId);
			if (deletedPageId === currentPageId) {
				navigate("/");
			}
		},
	});

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent className="w-56 rounded-lg">
				<ContextMenuItem>
					<LinkIcon className="text-muted-foreground" />
					<span>Copy Link</span>
				</ContextMenuItem>
				<ContextMenuItem>
					<ArrowUpRightIcon className="text-muted-foreground" />
					<span>Open in New Tab</span>
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem
					onClick={(e) => {
						e.stopPropagation();
						handleDeletePage({ id: pageData.id });
					}}
					variant="destructive"
				>
					<TrashIcon className="text-muted-foreground" />
					<span>Delete</span>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
