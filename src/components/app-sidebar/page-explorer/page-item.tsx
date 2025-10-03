import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { FileIcon } from "@phosphor-icons/react/dist/csr/File";
import { SpinnerIcon } from "@phosphor-icons/react/dist/csr/Spinner";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
} from "@/components/ui/sidebar";
import { useYjsWorkspace } from "@/features/yjs-workspace";
import { usePageChildrenQuery } from "@/services/pages";
import type { PagePreview } from "@/types";
import { cn } from "@/utils";
import PageItemContextMenu from "./page-item-context-menu";

interface PageItemProps {
	pageId: string;
	pageData: PagePreview;
}

/**
 * Đại diện cho một trang trong danh sách, có thể là trang gốc hoặc trang con.
 * Hỗ trợ mở rộng để hiển thị các trang con, hiển thị icon, tiêu đề và trạng
 * thái đang chọn. Khi hover sẽ hiện nút mở rộng, và có menu ngữ cảnh cho các
 * thao tác như xóa, copy link.
 */
export default function PageItem({ pageId, pageData }: PageItemProps) {
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
		isSuccess,
	} = usePageChildrenQuery(pageId, {
		enabled: currentPageId === pageId,
		initialData: [],
	});
	const [pageChildren, setPageChildren] = useState<PagePreview[]>([]);

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
		(async () => {
			if (isCollapseOpen) {
				await fetchPageChildren();
			}
		})();
	}, [isCollapseOpen, fetchPageChildren]);

	useEffect(() => {
		const pageChildrenShared = provider.document.getMap<PagePreview>(pageId);
		pageChildrenData?.forEach((child) => {
			pageChildrenShared.set(child.id, child);
		});
	}, [pageChildrenData, pageId, provider]);

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
		<PageItemContextMenu pageData={pageData}>
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
							{isSuccess &&
								Array.isArray(pageChildren) &&
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
		</PageItemContextMenu>
	);
}
