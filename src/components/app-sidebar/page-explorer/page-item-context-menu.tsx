import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { LinkIcon } from "@phosphor-icons/react/dist/csr/Link";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import { type MouseEvent, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useYjsWorkspace } from "@/features/yjs-workspace";
import { usePageDelete } from "@/services/pages";
import type { PagePreview } from "@/types";

interface ContextItemProps {
	pageData: PagePreview;
}

interface PageItemContextMenuProps extends ContextItemProps {
	children: React.ReactNode;
}

/**
 * Bọc quanh mỗi PageItem để cung cấp menu ngữ cảnh (context menu) cho các thao
 * tác như copy link, mở tab mới, xóa trang....
 */
export default function PageItemContextMenu({
	pageData,
	children,
}: PageItemContextMenuProps) {
	const { pageId: currentPageId } = useParams();

	const navigate = useNavigate();
	const workspaceProvider = useYjsWorkspace((state) => state.provider);
	const workspaceId = useYjsWorkspace((state) => state.activeWorkspace.id);

	const { mutate: deletePage } = usePageDelete(workspaceProvider, {
		onSuccess: (deletedPageId) => {
			// Nếu trang bị xoá là trang hiện tại thì chuyển về home
			if (deletedPageId === currentPageId) navigate("/");
		},
	});

	const handleOnDelete = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			e.stopPropagation();
			console.log("before: ", pageData);
			deletePage({
				page_id: pageData.id,
				parent_page_id: pageData.parent_page_id,
			});
		},
		[deletePage, pageData],
	);

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent className="w-56 rounded-lg">
				<CopyLinkItem pageData={pageData} workspaceId={workspaceId} />
				<ContextMenuItem>
					<ArrowUpRightIcon className="text-muted-foreground" />
					<span>Open in New Tab</span>
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem onClick={handleOnDelete} variant="destructive">
					<TrashIcon className="text-muted-foreground" />
					<span>Delete</span>
				</ContextMenuItem>
				<ContextMenuItem
					onClick={(e) => {
						e.stopPropagation();
						console.log(pageData);
					}}
					variant="destructive"
				>
					<span>DEBUG</span>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

interface CopyLinkItemProps extends ContextItemProps {
	workspaceId: string;
}

function CopyLinkItem({ pageData, workspaceId }: CopyLinkItemProps) {
	const handleOnClick = () => {
		const origin = window.location.origin;
		navigator.clipboard.writeText(`${origin}/${workspaceId}/${pageData.id}`);
		toast(
			<div className="flex items-center gap-2">
				<LinkIcon className="text-muted-foreground" size={16} /> Link copied!
			</div>,
		);
	};

	return (
		<ContextMenuItem onClick={handleOnClick}>
			<LinkIcon className="text-muted-foreground" />
			<span>Copy Link</span>
		</ContextMenuItem>
	);
}
