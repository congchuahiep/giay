import { FileIcon } from "@phosphor-icons/react/dist/csr/File";
import { useEffect } from "react";
import { Transforms } from "slate";
import {
	ReactEditor,
	type RenderElementProps,
	useSelected,
	useSlateStatic,
} from "slate-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { PageBlock as PageBlockType } from "@/features/editor/types";
import {
	usePageCreate,
	usePageDelete,
	usePagePreviewQuery,
} from "@/services/pages";
import { cn } from "@/utils";
import { useNavigate } from "react-router-dom";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import { useYjsWorkspace } from "@/features/yjs-workspace";
import { useYjsPage } from "@/features/yjs-page";
import { useShortcutStore } from "@/core/shortcut";

export default function PageBlock(props: RenderElementProps) {
	const navigate = useNavigate();
	const editor = useSlateStatic();
	const isSelected = useSelected();
	const setActiveShortcutScope = useShortcutStore(
		(state) => state.setActiveShortcutScope,
	);

	const currentPage = useYjsPage((state) => state.currentPage);
	const activeWorkspace = useYjsWorkspace((state) => state.activeWorkspace);
	const element = props.element as PageBlockType;

	const { mutate: createPage } = usePageCreate(activeWorkspace.id, {
		onSuccess: (data) => {
			const path = ReactEditor.findPath(editor, props.element);
			Transforms.setNodes(editor, { pageId: data.id }, { at: path });
		},
	});

	const { data: page, isLoading } = usePagePreviewQuery(element.pageId, {
		retry: (failureCount, error) => {
			if (error.message.includes("404")) {
				createPage({ parentPageId: currentPage.id });
				return false;
			}
			return failureCount < 3;
		},
	});

	// Khi focus vào page block -> Chuyển shortcut scope về `editor.page-block`
	useEffect(() => {
		if (isSelected) setActiveShortcutScope("editor.page-block");
		else setActiveShortcutScope("editor");
	}, [isSelected, setActiveShortcutScope]);

	const handleOnClick = () => {
		if (!page) return;
		navigate(`/${activeWorkspace.id}/${page.id}`);
	};

	return (
		<PageBlockContextMenu element={element} render={!isLoading}>
			<div
				{...props.attributes}
				className={cn("rounded-sm p-1", isSelected && "bg-primary/30")}
			>
				<Button
					variant="secondary"
					className={cn(
						" p-0 border shadow-none w-full cursor-pointer justify-start",
						"text-stone-800 bg-stone-50/50 hover:bg-stone-100 border-stone-300/50",
						"dark:text-stone-50 dark:bg-stone-800/50 dark:hover:bg-stone-800 dark:border-stone-700/50",
					)}
					contentEditable={false}
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
	element: PageBlockType;
	render?: boolean;
}

function PageBlockContextMenu({
	children,
	element,
	render = true,
}: PageBlockContextMenuProps) {
	const editor = useSlateStatic();

	const { mutate: deletePage } = usePageDelete();

	const handleOnDelete = () => {
		const path = ReactEditor.findPath(editor, element);
		Transforms.delete(editor, { at: path });
		deletePage({ id: element.pageId });
	};

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
