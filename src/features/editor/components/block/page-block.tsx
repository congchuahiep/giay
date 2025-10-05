import { FileIcon } from "@phosphor-icons/react/dist/csr/File";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Transforms } from "slate";
import {
	ReactEditor,
	type RenderElementProps,
	useSelected,
	useSlateStatic,
} from "slate-react";
import { toast } from "sonner";
import type { YMapEvent } from "yjs";
import { Button } from "@/components/ui/button";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { PageBlock as PageBlockType } from "@/features/editor/types";
import { useShortcut } from "@/features/shortcut";
import { useYjsPage } from "@/features/yjs-page";
import { useYjsWorkspace } from "@/features/yjs-workspace";
import { usePageCreate, usePageDelete } from "@/services/pages";
import type { PagePreview } from "@/types";
import { cn } from "@/utils";

export default function PageBlock(props: RenderElementProps) {
	const navigate = useNavigate();
	const editor = useSlateStatic();
	const isSelected = useSelected();
	const setActiveShortcutScope = useShortcut(
		(state) => state.setActiveShortcutScope,
	);

	const currentPage = useYjsPage((state) => state.currentPage);
	const activeWorkspace = useYjsWorkspace((state) => state.activeWorkspace);
	const workspaceProvider = useYjsWorkspace((state) => state.provider);
	const element = props.element as PageBlockType;

	const [pageData, setPageData] = useState<PagePreview | null | undefined>(
		undefined,
	);

	/// Khởi tạo các Services
	// const { data: page, isLoading } = usePagePreviewQuery(element.pageId);

	const { mutate: createPage } = usePageCreate(
		activeWorkspace.id,
		workspaceProvider,
		{
			onSuccess: (data) => {
				const path = ReactEditor.findPath(editor, element);
				Transforms.setNodes(editor, { pageId: data.id }, { at: path });
			},
		},
	);

	const { mutate: deletePage, isPending: deleting } = usePageDelete(
		workspaceProvider,
		{
			onError: (error) => {
				const path = ReactEditor.findPath(editor, element);
				editor.setNodes({ isDeleted: false }, { at: path });
				toast.error("Failed to delete page!");
				console.error("Error deleting page:", error);
			},
		},
	);

	/**
	 * Xử lý việc xoá page + xoá trong database
	 */
	const handleOnDelete = useCallback(() => {
		if (!element.pageId) return;
		const path = ReactEditor.findPath(editor, element);
		editor.setNodes({ isDeleted: true }, { at: path });
	}, [element, editor]);

	/**
	 * Xử lý việc nhấn và để truy cập trang
	 */
	const handleOnClick = () => {
		if (!pageData) return;
		navigate(`/${activeWorkspace.id}/${pageData.id}`);
	};

	/**
	 * Lấy dữ liệu trang như `title`, `icon` từ yDoc
	 *
	 * Ta chả cần fetch dữ liệu lại từ database làm gì cả, vì sau khi mở trang
	 * cha, dữ liệu PagePreview của trang con đã được fetch và lưu vào yDoc của
	 * workspaceProvider rồi
	 *
	 * Đồng thời cũng xử lý việc xoá page-block trên editor
	 */
	useEffect(() => {
		// Khởi tạo trang mới nếu như block page chưa tồn tại pageId
		if (!element.pageId) {
			createPage({ parentPageId: currentPage.id });
			return;
		}

		const parentChildrenYDoc = workspaceProvider.document.getMap<PagePreview>(
			currentPage.id,
		);

		// Xử lý đồng bộ dữ liệu trang theo thời gian thực.
		const updatePageData = () => {
			if (!element.pageId) return;
			const newPageData = parentChildrenYDoc.get(element.pageId);
			setPageData(newPageData);
		};

		// Cập nhật lần đầu
		updatePageData();

		// Xử lý việc tự động đồng bộ trang bằng cách kiểm
		const handlePageChildrenChange = (event: YMapEvent<PagePreview>) => {
			if (!element.pageId) return;
			if (event.keysChanged.has(element.pageId)) {
				updatePageData();
			}
		};

		parentChildrenYDoc.observe(handlePageChildrenChange);

		return () => parentChildrenYDoc.unobserve(handlePageChildrenChange);
	}, [workspaceProvider, currentPage.id, element, createPage]);

	/**
	 * Khi focus vào page block -> Chuyển shortcut scope về `editor.page-block`
	 */
	useEffect(() => {
		if (isSelected) setActiveShortcutScope("editor.page-block");
		else setActiveShortcutScope("editor");
	}, [isSelected, setActiveShortcutScope]);

	/**
	 * Khi thuộc tính `isDelete` của block là true -> Xóa page và block
	 *
	 * Cái này để dùng khi người dùng lỡ xoá trang bằng phím "backspace"
	 */
	useEffect(() => {
		if (!element.isDeleted) return;
		if (!element.pageId) return;
		deletePage({ page_id: element.pageId, parent_page_id: currentPage.id });
	}, [element.isDeleted, element.pageId, deletePage, currentPage.id]);

	/**
	 * Xử lý việc page này đã bị xoá ở một nơi khác (như sidebar) -> xoá page
	 * block này
	 */
	useEffect(() => {
		if (!pageData) return;
		if (pageData.is_deleted) {
			editor.deleteBlockById(element.id);
		}
	}, [pageData, element, editor]);

	return (
		<PageBlockContextMenu render={!!pageData} handleOnDelete={handleOnDelete}>
			<div
				{...props.attributes}
				className={cn(
					"rounded-sm p-1",
					isSelected && "bg-primary/30",
					deleting && "invisible", // Khi đang xoá sẽ không hiển thị gì cả
				)}
				contentEditable={false}
			>
				<Button
					variant="secondary"
					className={cn(
						" p-0 border shadow-none w-full cursor-pointer justify-start",
						"text-stone-800 bg-stone-50/80 hover:bg-stone-100 border-stone-300/50",
						"dark:text-stone-50 dark:bg-stone-900/80 dark:hover:bg-stone-800 dark:border-stone-700/50",
					)}
					onClick={handleOnClick}
				>
					{pageData ? (
						<div className="pl-3 p-1 gap-2 flex items-center select-none">
							<span>
								{pageData.icon ? (
									pageData.icon
								) : (
									<FileIcon weight="duotone" size={16} width={20} />
								)}
							</span>
							<span>{pageData.title ? pageData.title : "Untitled"}</span>
						</div>
					) : (
						<Skeleton className="w-full h-full opacity-25" />
					)}
					{/* Hidden children để Slate vẫn có thể track */}
					<span className="hidden select-none">{props.children}</span>
				</Button>
			</div>
		</PageBlockContextMenu>
	);
}

interface PageBlockContextMenuProps {
	children: React.ReactNode;
	handleOnDelete: () => void;
	render?: boolean;
}

function PageBlockContextMenu({
	children,
	handleOnDelete,
	render = true,
}: PageBlockContextMenuProps) {
	if (!render) return children;

	return (
		<div>
			<ContextMenu>
				<ContextMenuTrigger>{children}</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem variant="destructive" onClick={handleOnDelete}>
						<TrashIcon /> Delete page
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>
		</div>
	);
}
