import { FileIcon } from "@phosphor-icons/react/dist/csr/File";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Transforms } from "slate";
import {
	ReactEditor,
	type RenderElementProps,
	useSelected,
	useSlateStatic,
} from "slate-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useShortcutStore } from "@/core/shortcut";
import type { PageBlock as PageBlockType } from "@/features/editor/types";
import { useYjsPage } from "@/features/yjs-page";
import { useYjsWorkspace } from "@/features/yjs-workspace";
import {
	usePageCreate,
	usePageDelete,
	usePagePreviewQuery,
} from "@/services/pages";
import { cn } from "@/utils";

export default function PageBlock(props: RenderElementProps) {
	const navigate = useNavigate();
	const editor = useSlateStatic();
	const isSelected = useSelected();
	const setActiveShortcutScope = useShortcutStore(
		(state) => state.setActiveShortcutScope,
	);

	const currentPage = useYjsPage((state) => state.currentPage);
	const activeWorkspace = useYjsWorkspace((state) => state.activeWorkspace);
	const workspaceProvider = useYjsWorkspace((state) => state.provider);
	const element = props.element as PageBlockType;

	/// Khởi tạo các Services
	const { data: page, isLoading } = usePagePreviewQuery(element.pageId);

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
				console.error("Error deleting page:", error);
				const path = ReactEditor.findPath(editor, element);
				editor.setNodes({ isDeleted: false }, { at: path });
				toast.error("Failed to delete page!");
			},
			onSuccess: () => {
				const path = ReactEditor.findPath(editor, element);
				Transforms.delete(editor, { at: path });
			},
		},
	);

	/**
	 * Xử lý việc xoá page + xoá trong database
	 */
	const handleOnDelete = useCallback(() => {
		if (!element.pageId) return;
		const path = ReactEditor.findPath(editor, element);
		editor.setNodes({ isDeleted: false }, { at: path });
		deletePage({ page_id: element.pageId, parent_page_id: currentPage.id });
	}, [element, deletePage, editor, currentPage.id]);

	/**
	 * Xử lý việc nhấn và để truy cập trang
	 */
	const handleOnClick = () => {
		if (!page) return;
		navigate(`/${activeWorkspace.id}/${page.id}`);
	};

	/**
	 * Khởi tạo page nếu chưa có pageId
	 */
	useEffect(() => {
		if (!element.pageId) createPage({ parentPageId: currentPage.id });
	}, [element.pageId, currentPage.id, createPage]);

	/**
	 * 	Khi focus vào page block -> Chuyển shortcut scope về `editor.page-block`
	 */
	useEffect(() => {
		if (isSelected) setActiveShortcutScope("editor.page-block");
		else setActiveShortcutScope("editor");
	}, [isSelected, setActiveShortcutScope]);

	/**
	 * 	Khi page block bị xóa -> Xóa page và block
	 */
	useEffect(() => {
		if (!element.isDeleted) return;
		if (!element.pageId) return;
		deletePage({ page_id: element.pageId, parent_page_id: currentPage.id });
	}, [element.isDeleted, element.pageId, deletePage, currentPage.id]);

	// Khi đang xoá sẽ không hiển thị gì cả
	if (deleting) return null;

	return (
		<PageBlockContextMenu render={!isLoading} handleOnDelete={handleOnDelete}>
			<div
				{...props.attributes}
				className={cn("rounded-sm p-1", isSelected && "bg-primary/30")}
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
					{page && !isLoading ? (
						<div className="pl-3 p-1 gap-2 flex items-center select-none">
							<span>
								{page.icon ? (
									page.icon
								) : (
									<FileIcon weight="duotone" size={16} width={20} />
								)}
							</span>
							<span>{page.title ? page.title : "Untitled"}</span>
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
