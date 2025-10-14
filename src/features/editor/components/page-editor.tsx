import { YjsEditor } from "@slate-yjs/core";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { RenderElementProps, RenderLeafProps } from "slate-react";
import { Editable, Slate, withReact } from "slate-react";
import * as Y from "yjs";
import { initialEditor } from "@/features/editor";
import useDecorate from "@/features/editor/hooks/useDecorate";
import { renderBlock, renderLeaf } from "@/features/editor/render";
import { useClipboard } from "@/features/editor-plugins/clipboard";
import { withDeleteEditor } from "@/features/editor-plugins/delete";
import {
	FormatShortcutExtension,
	MarkShortcutExtension,
	withFormatEditor,
} from "@/features/editor-plugins/format";
import { withInsertEditor } from "@/features/editor-plugins/insert";
import {
	MarkdownShortcutExtension,
	withMarkdownEditor,
} from "@/features/editor-plugins/markdown";
import {
	PageBlockShortcutExtension,
	withPageBlock,
} from "@/features/editor-plugins/page-block";
import { withSelectEditor } from "@/features/editor-plugins/select";
import {
	SlashMenu,
	withSlashEditor,
} from "@/features/editor-plugins/slash-menu";
import {
	DefaultBehaviourShortCutExtension,
	withUtilsEditor,
} from "@/features/editor-plugins/utils";
import { useRegisterShortcuts, useShortcut } from "@/features/shortcut";
import { useYjsPage, useYjsPageLocalSave } from "@/features/yjs-page";
import { useYjsWorkspace } from "@/features/yjs-workspace";
import { useFetchPageChildrenShared } from "@/services/pages";
import { cn } from "@/utils";
import { DragProvider } from "./block-interaction/drag-provider";
import { CollaborateCursors } from "./collaborate-cursor";
import TrailingEmptyParagraph from "./helper/trailing-empty-paragraph";
import TitleEditor from "./title-editor";
import { HoveringToolbar, Toolbar } from "./toolbar";

/**
 * Danh sách các plugin
 */
const plugins = [
	withMarkdownEditor,
	withSlashEditor,
	withInsertEditor,
	withDeleteEditor,
	withUtilsEditor,
	withSelectEditor,
	withFormatEditor,
	withPageBlock,
	withReact,
	// withHistory,
];

const editorShortcutExtensions = [
	FormatShortcutExtension,
	MarkShortcutExtension,
	MarkdownShortcutExtension,
	DefaultBehaviourShortCutExtension,
];

const pageShortcutExtensions = [PageBlockShortcutExtension];

/**
 *
 * @see features/yjs-page - Dùng để nạp và lưu dữ liệu shared (dữ liệu có thể
 * cộng tác của trình soạn thảo)
 */
const PageEditor = () => {
	const editorRef = useRef<HTMLDivElement>(null);

	const navigate = useNavigate();

	const pageProvider = useYjsPage((state) => state.provider);
	const status = useYjsPage((state) => state.status);
	const currentPageId = useYjsPage((state) => state.currentPage.id);
	const workspaceProvider = useYjsWorkspace((state) => state.provider);
	const workspaceId = useYjsWorkspace((state) => state.activeWorkspace.id);

	const pageContentData = useMemo(
		() => pageProvider.document.get("content", Y.XmlText),
		[pageProvider],
	);

	// Khởi tạo editor
	const editor = useMemo(
		() => initialEditor(plugins, pageContentData, pageProvider),
		[pageContentData, pageProvider],
	);

	const pageBlockShortcutContext = useMemo(() => {
		return {
			editor,
			workspaceId,
			navigate,
		};
	}, [editor, workspaceId, navigate]);

	const memoizedRenderLeaf = useCallback(
		(props: RenderLeafProps) => renderLeaf(props),
		[],
	);

	const memoizedRenderBlock = useCallback(
		(props: RenderElementProps) => renderBlock(props),
		[],
	);

	const decorate = useDecorate();

	// Kết nối với Yjs
	useEffect(() => {
		// console.log(location.state?.fromSidebar);

		YjsEditor.connect(editor);
		return () => {
			YjsEditor.disconnect(editor);
		}; // Đóng kết nối khi kết thúc làm việc
	}, [editor]);

	// Tự động fetch tất cả các trang con có trong trang hiện tại
	useFetchPageChildrenShared(currentPageId, workspaceProvider);

	// Tự động lưu nội dung trang xuống dữ liệu máy client (Tauri-only)
	useYjsPageLocalSave(currentPageId, workspaceId, pageProvider);

	// Đăng ký sự kiện bàn phím
	useRegisterShortcuts(editor, editorShortcutExtensions);
	useRegisterShortcuts(pageBlockShortcutContext, pageShortcutExtensions);

	const { setActiveShortcutScope } = useShortcut();

	const [handlePaste, handleCopy] = useClipboard(editor);

	return (
		<Slate editor={editor} initialValue={[]}>
			<DragProvider editor={editor}>
				<CollaborateCursors>
					<Toolbar />
					<TitleEditor />
					{status === "disconnected" && (
						<div
							className={cn(
								"text-xs z-50 fixed right-8 top-16 py-1 px-2 bg-stone-600",
								"text-white rounded",
							)}
						>
							offline
						</div>
					)}
					<div className="relative flex flex-col h-full">
						{editorRef && <HoveringToolbar containerRef={editorRef} />}
						{editorRef && <SlashMenu />}

						<Editable
							ref={editorRef}
							className={cn(
								"focus:outline-none selection:bg-blue-500/15 outline-0",
								"overflow-visible",
							)}
							decorate={decorate}
							renderLeaf={memoizedRenderLeaf}
							renderElement={memoizedRenderBlock}
							onPaste={handlePaste}
							onCopy={handleCopy}
							onFocus={() => setActiveShortcutScope("editor")}
							onBlur={() => setActiveShortcutScope()}
							spellCheck={false}
							autoFocus
						/>

						<TrailingEmptyParagraph />

						{/*<BlockSelectionComponent />*/}
					</div>
				</CollaborateCursors>
			</DragProvider>
		</Slate>
	);
};

export default PageEditor;
