// Import React dependencies.
import { useCallback, useEffect, useMemo, useState } from "react";
// Import the Slate editor factory.
import { type Descendant } from "slate";
import type { RenderElementProps, RenderLeafProps } from "slate-react";
import { Editable, Slate } from "slate-react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

// Import the Slate components and React plugin.
import { initialEditor, useShortcut } from "@/features/editor";
import { renderBlock, renderLeaf } from "@/features/editor/render";
import { loadContentFromLocal } from "@/features/editor/stores/localStorage";
import { YjsEditor } from "@slate-yjs/core";

import { Cursors } from "./Cursor";
import Toolbar from "./Toolbar";

import type { ShortcutConfig } from "@/features/editor/shortcut";
/**
 * Khởi động Editor với tính năng cộng tác
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
      ? storedContent
      : [
          {
            type: "paragraph",
            children: [{ text: "" }],
          },
        ];
  }, []);

  // Khởi tạo editor
  const editor = useMemo(
    () => initialEditor(sharedType, provider, initialValue),
    [provider, sharedType, initialValue]
  );

  const customConfig: ShortcutConfig = {
    "mod+shift+b": "mark-bold",
    "mod+shift+i": "mark-italic",
    "ctrl+k": "toggle-code-block",
  };

  const shortcutHandle = useShortcut(editor, customConfig);

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

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      // onChange={saveEditorContent(editor)}
    >
      <Cursors>
        <div className="relative">
          <Toolbar />
          <Editable
            className="focus:outline-none selection:bg-blue-500/15"
            style={{ outline: "0px" }}
            renderLeaf={memoizedRenderLeaf} // Định nghĩa render inline
            renderElement={memoizedRenderBlock} // Định nghĩa render block
            onKeyDown={shortcutHandle} // Đăng ký các shortcut
            autoFocus
            // placeholder="Type something"
          />
          {/*<BlockSelectionComponent />*/}
        </div>
      </Cursors>
    </Slate>
  );
};

export default CollaborativeEditor;

// TODO Editor hiện tại rất chậmmmm, chả hiểu tại sao, nhưng trên firefox lại nhanh
// hơn rất nhiều, có thể nó liên quan đến việc chưa tối ưu DOM painting
