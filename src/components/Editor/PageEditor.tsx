// Import React dependencies.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// Import the Slate editor factory.
import { Element, type Descendant, type NodeEntry } from "slate";
import type { RenderElementProps, RenderLeafProps } from "slate-react";
import { Editable, Slate, withReact } from "slate-react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

// Import the Slate components and React plugin.
import { initialEditor } from "@/features/editor";
import { renderBlock, renderLeaf } from "@/features/editor/render";
import { YjsEditor } from "@slate-yjs/core";

import { Cursors } from "./Cursor";
import Toolbar from "./Toolbar";

import { DragProvider } from "@/components/Editor/BlockInteraction/DragProvider";
import HoveringToolbar from "@/components/Editor/HoveringToolbar";
import SlashMenu from "@/components/Editor/SlashMenu/SlashMenu";
import TrailingEmptyParagraph from "@/components/Editor/TrailingEmptyParagraph";
import { useRegisterShortcuts, useShortcutStore } from "@/core/shortcut";
import useClipboard from "@/features/editor/plugins/clipboard";
import { withDeleteEditor } from "@/features/editor/plugins/delete";
import {
	FormatShortcutExtension,
	MarkShortcutExtension,
	withFormatEditor,
} from "@/features/editor/plugins/format";
import { withInsertEditor } from "@/features/editor/plugins/insert";
import {
	MarkdownShortcutExtension,
	withMarkdownEditor,
} from "@/features/editor/plugins/markdown";
import { withSelectEditor } from "@/features/editor/plugins/select";
import { withSlashEditor } from "@/features/editor/plugins/slash-menu";
import {
	DefaultBehaviourShortCutExtension,
	withUtilsEditor,
} from "@/features/editor/plugins/utils";
import TitleEditor from "./TitleEditor";
import useDecorate from "@/features/editor/hooks/useDecorate";
import { useYjsPage } from "@/features/yjs-page";
import { useNavigate } from "react-router-dom";
import {
	PageBlockShortcutExtension,
	withPageBlock,
} from "@/features/editor/plugins/page-block";
import { useYjsWorkspace } from "@/features/yjs-workspace";

/**
 * Danh sách các plugin
 */
const plugins = [
	withPageBlock,
	withMarkdownEditor,
	withSlashEditor,
	withInsertEditor,
	withDeleteEditor,
	withUtilsEditor,
	withSelectEditor,
	withFormatEditor,
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

const PageEditor = () => {
	const navigate = useNavigate();

	const editorRef = useRef<HTMLDivElement>(null);
	const provider = useYjsPage((state) => state.provider);
	const workspaceId = useYjsWorkspace((state) => state.activeWorkspace.id);
	const status = useYjsPage((state) => state.status);

	const pageContentData = useMemo(
		() => provider.document.get("content", Y.XmlText),
		[provider],
	);

	// Khởi tạo editor
	const editor = useMemo(
		() => initialEditor(plugins, pageContentData, provider),
		[pageContentData, provider],
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
		YjsEditor.connect(editor);
		return () => {
			YjsEditor.disconnect(editor);
		}; // Đóng kết nối khi kết thúc làm việc
	}, [editor]);

	// Đăng ký sự kiện bàn phím
	useRegisterShortcuts("editor", editor, editorShortcutExtensions);
	useRegisterShortcuts(
		"editor",
		pageBlockShortcutContext,
		pageShortcutExtensions,
	);

	const { setActiveShortcutScope } = useShortcutStore();

	const [handlePaste, handleCopy] = useClipboard(editor);

	return (
		<Slate editor={editor} initialValue={[]}>
			<DragProvider editor={editor}>
				<Cursors>
					{/*<Toolbar />*/}
					<TitleEditor />
					{status === "disconnected" && (
						<div className="text-xs z-100 fixed right-8 top-16 py-1 px-2 bg-stone-600 text-white rounded">
							offline
						</div>
					)}
					<div className="relative flex flex-col h-full">
						{editorRef && <HoveringToolbar containerRef={editorRef} />}
						{editorRef && <SlashMenu />}

						<Editable
							ref={editorRef}
							className="focus:outline-none selection:bg-blue-500/15 outline-0 overflow-visible"
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
				</Cursors>
			</DragProvider>
		</Slate>
	);
};

export default PageEditor;
