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
import { useNavigate, useParams } from "react-router-dom";
import { LinkIcon } from "@phosphor-icons/react/dist/csr/Link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";

interface PageItemContextMenuProps {
	pageData: PagePreview;
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
	const provider = useYjsWorkspace((state) => state.provider);

	const { mutate: handleDeletePage } = usePageDelete(provider, {
		onSuccess: (deletedPageId) => {
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
						handleDeletePage({ page_id: pageData.id });
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
