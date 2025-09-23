import { FileIcon } from "@phosphor-icons/react/dist/csr/File";
import { useEffect } from "react";
import { Transforms } from "slate";
import {
	ReactEditor,
	type RenderElementProps,
	useSlateStatic,
} from "slate-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useYjsWorkspaceContext } from "@/contexts/useYjsWorkspaceContext";
import type { PageBlock as PageBlockType } from "@/features/editor/types";
import { useYjsPageEditorContext } from "@/hooks/YjsPageEditorProvider";
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

export default function PageBlock(props: RenderElementProps) {
	const { activeWorkspace } = useYjsWorkspaceContext();
	const { activePage } = useYjsPageEditorContext();
	const navigate = useNavigate();
	const editor = useSlateStatic();
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
				createPage({ parentPageId: activePage.id });
				return false;
			}
			return failureCount < 3;
		},
	});

	const handleOnClick = () => {
		if (!page) return;
		navigate(`/${activeWorkspace.id}/${page.id}`);
	};

	return (
		<PageBlockContextMenu element={element} render={!isLoading}>
			<Button
				variant="secondary"
				className={cn(
					"m-1 p-0 border border-stone-300/50 w-full cursor-pointer justify-start",
					"text-stone-800 bg-stone-50/50 hover:bg-stone-100 shadow-none",
					"dark:text-stone-50 dark:bg-stone-600/50 dark:hover:bg-stone-800",
				)}
				onClick={handleOnClick}
			>
				{page && !isLoading ? (
					<div className="pl-3 p-1 gap-2 flex items-center">
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
