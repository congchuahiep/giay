// Import React dependencies.
import { useCallback, useEffect, useMemo, useState } from "react";
// Import the Slate editor factory.
import { type Descendant } from "slate";
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
import SlashCommandMenu from "@/components/Editor/SlashMenu/SlashMenu";
import TrailingEmptyParagraph from "@/components/Editor/TrailingEmptyParagraph";
import { useRegisterShortcuts } from "@/core/shortcut";
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
import {
  SlashCommandShortcutExtension,
  withSlashEditor,
} from "@/features/editor/plugins/slash-command";
import {
  DefaultBehaviourShortCutExtension,
  withUtilsEditor,
} from "@/features/editor/plugins/utils";

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
  withReact,
  // withHistory,
];

/**
 * Danh sách các phím tắt tuỳ chỉnh
 */
// const editorConfig: ShortcutConfig = {
//   "mod+shift+b": "mark-bold",
//   "mod+shift+i": "mark-italic",
//   "ctrl+k": "toggle-code-block",
// };

const editorExtensions = [
  FormatShortcutExtension,
  MarkShortcutExtension,
  MarkdownShortcutExtension,
  SlashCommandShortcutExtension,
  DefaultBehaviourShortCutExtension,
];

const PageEditor = ({
  sharedType,
  provider,
}: {
  sharedType: Y.XmlText;
  provider: WebsocketProvider | undefined;
}) => {
  const [initialValue] = useState<Descendant[]>([]);

  // Khởi tạo editor
  const editor = useMemo(
    () => initialEditor(plugins, sharedType, provider),
    [provider, sharedType]
  );

  const memoizedRenderLeaf = useCallback(
    (props: RenderLeafProps) => renderLeaf(props),
    []
  );

  const memoizedRenderBlock = useCallback(
    (props: RenderElementProps) => renderBlock(props),
    []
  );

  // Kết nối với Yjs
  useEffect(() => {
    YjsEditor.connect(editor);
    return () => YjsEditor.disconnect(editor); // Đóng kết nối khi kết thúc làm việc
  }, [editor]);

  // Khúc này đăng ký các sự kiện
  const { enableShortcuts, disableShortcuts } = useRegisterShortcuts(
    "editor",
    editor,
    editorExtensions
  ) || {
    enableShortcuts: undefined,
    disableShortcuts: undefined,
  };

  const [handlePaste, handleCopy] = useClipboard(editor);

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <DragProvider editor={editor}>
        <Cursors>
          <div className="relative h-screen flex flex-col">
            <Toolbar />
            <HoveringToolbar />

            <Editable
              className="focus:outline-none selection:bg-blue-500/15 outline-0"
              renderLeaf={memoizedRenderLeaf}
              renderElement={memoizedRenderBlock}
              onPaste={handlePaste}
              onCopy={handleCopy}
              onFocus={() => enableShortcuts && enableShortcuts()}
              onBlur={() => disableShortcuts && disableShortcuts()}
              placeholder="Start typing..."
              spellCheck={false}
              autoFocus
            />
            <TrailingEmptyParagraph />
            <SlashCommandMenu />

            {/*<BlockSelectionComponent />*/}
          </div>
        </Cursors>
      </DragProvider>
    </Slate>
  );
};

export default PageEditor;
