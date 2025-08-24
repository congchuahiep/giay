// Import React dependencies.
import { useCallback, useEffect, useMemo, useState } from "react";
// Import the Slate editor factory.
import { type Descendant } from "slate";
import type { RenderElementProps, RenderLeafProps } from "slate-react";
import { Editable, Slate, withReact } from "slate-react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

// Import the Slate components and React plugin.
import { initialEditor, useShortcut } from "@/features/editor";
import { renderBlock, renderLeaf } from "@/features/editor/render";
import { loadContentFromLocal } from "@/features/editor/stores/localStorage";
import { YjsEditor } from "@slate-yjs/core";

import { Cursors } from "./Cursor";
import Toolbar from "./Toolbar";

import { DragProvider } from "@/components/Editor/BlockInteraction/DragProvider";
import HoveringToolbar from "@/components/Editor/HoveringToolbar";
import SlashCommandMenu from "@/components/Editor/SlashMenu/SlashMenu";
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
import type { ShortcutConfig } from "@/core/shortcut";
import {
  SlashCommandShortcutExtension,
  withSlashEditor,
} from "@/features/editor/plugins/slash-command";
import {
  DefaultBehaviourShortCutExtension,
  withUtilsEditor,
} from "@/features/editor/plugins/utils";
import { withHistory } from "slate-history";
import { v4 as uuidv4 } from "uuid";
import type { DragEndEvent } from "@dnd-kit/core";

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
  withHistory,
];

/**
 * Danh sách các phím tắt tuỳ chỉnh
 */
const customConfig: ShortcutConfig = {
  "mod+shift+b": "mark-bold",
  "mod+shift+i": "mark-italic",
  "ctrl+k": "toggle-code-block",
};

const customExtensions = [
  FormatShortcutExtension,
  MarkShortcutExtension,
  MarkdownShortcutExtension,
  SlashCommandShortcutExtension,
  DefaultBehaviourShortCutExtension,
];

/**
 * Khởi động Editor bao gồm các tính năng cộng tác
 */
const CollaborativeEditor = () => {
  const [connected, setConnected] = useState(false);
  const [sharedType, setSharedType] = useState<Y.XmlText | undefined>(
    undefined
  );
  const [provider, setProvider] = useState<WebsocketProvider | undefined>(
    undefined
  );

  // Khởi động Yjs provider và các tài liệu liên quan
  useEffect(() => {
    const yDoc = new Y.Doc();
    const sharedDoc = yDoc.get("slate", Y.XmlText);

    // Thiết lập Yjs provider,tự chọn provider (ở đây đang sử dụng y-websocket)
    const yProvider = new WebsocketProvider(
      "ws://localhost:1234", // Địa chỉ websocket
      "slate-demo-room", // Tên phòng (room) dùng để sync
      yDoc
    );

    yProvider.on("status", (event) => {
      setConnected(event.status === "connected");
    });
    setSharedType(sharedDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.off("sync", setConnected);
      yProvider?.destroy();
    };
  }, []);

  if (!connected || !sharedType || !provider) {
    return <div>Loading…</div>;
  }

  return <SlateEditor sharedType={sharedType} provider={provider} />;
};

const SlateEditor = ({
  sharedType,
  provider,
}: {
  sharedType: Y.XmlText;
  provider: WebsocketProvider;
}) => {
  const initialValue: Descendant[] = useMemo(() => {
    const storedContent = loadContentFromLocal();
    return storedContent
      ? storedContent.map(editor.ensureBlockId)
      : [
          {
            id: uuidv4(),
            type: "paragraph",
            children: [{ text: "" }],
          },
        ];
  }, []);

  // Khởi tạo editor
  const editor = useMemo(
    () => initialEditor(plugins, sharedType, provider, initialValue),
    [provider, sharedType, initialValue]
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
  const handleShortcut = useShortcut(editor, customConfig, customExtensions);
  const [handlePaste, handleCopy] = useClipboard(editor);

  return (
    <DragProvider editor={editor}>
      <Slate
        editor={editor}
        initialValue={initialValue}
        // onChange={saveEditorContent(editor)}
      >
        <Cursors>
          <div className="relative">
            <Toolbar />
            <HoveringToolbar />

            <Editable
              className="focus:outline-none selection:bg-blue-500/15"
              style={{ outline: "0px" }}
              renderLeaf={memoizedRenderLeaf}
              renderElement={memoizedRenderBlock}
              onKeyDown={handleShortcut}
              onPaste={handlePaste}
              onCopy={handleCopy}
              autoFocus
            />
            <SlashCommandMenu />

            {/*<BlockSelectionComponent />*/}
          </div>
        </Cursors>
      </Slate>
    </DragProvider>
  );
};

export default CollaborativeEditor;
