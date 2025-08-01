import { withDeleteEditor } from "@/features/editor/delete";
import { withFormatEditor } from "@/features/editor/format";
import { withInsertEditor } from "@/features/editor/insert";
import { withMarkdownEditor } from "@/features/editor/markdown";
import { withSelectEditor } from "@/features/editor/select";
import { withSlashEditor } from "@/features/editor/slash-command";
import { withUtilsEditor } from "@/features/editor/utils";
import { withCursors, withYjs } from "@slate-yjs/core";
import {
  createEditor,
  Editor,
  Element,
  Transforms,
  type Descendant,
} from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import type { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

export default function initialEditor(
  sharedType: Y.XmlText,
  provider: WebsocketProvider,
  initialValue: Descendant[]
) {
  // Generate a random name and color for the cursor
  const randomNames = [
    "Alex",
    "Sam",
    "Jordan",
    "Taylor",
    "Morgan",
    "Casey",
    "Jamie",
    "Riley",
  ];
  const randomColors = [
    "#ff5733",
    "#33c1ff",
    "#ff33a6",
    "#33ff57",
    "#ffd633",
    "#8e44ad",
    "#e67e22",
    "#16a085",
  ];
  const name = randomNames[Math.floor(Math.random() * randomNames.length)];
  const color = randomColors[Math.floor(Math.random() * randomColors.length)];

  const editor = withHistory(
    withReact(
      withCursors(
        withYjs(
          withFormatEditor(
            withSelectEditor(
              withUtilsEditor(
                withDeleteEditor(
                  withInsertEditor(
                    withMarkdownEditor(withSlashEditor(createEditor()))
                  )
                )
              )
            )
          ),
          sharedType
        ),
        provider.awareness,
        {
          data: {
            name,
            color,
          },
        }
      )
    )
  );

  const { normalizeNode } = editor;

  editor.normalizeNode = (entry, options) => {
    const [node, path] = entry;

    // Nếu là Element (block) và không có ID, thêm ID
    if (Element.isElement(node) && !node.id && path.length === 1) {
      Transforms.setNodes(editor, { id: editor.generateId() }, { at: path });
      return;
    }

    // Nếu editor rỗng, thêm initial value với ID
    if (Editor.isEditor(node) && node.children.length === 0) {
      const initialValueWithIds = initialValue.map((block) =>
        editor.ensureBlockId(block)
      );
      Transforms.insertNodes(editor, initialValueWithIds, { at: [0] });
      return;
    }
    return normalizeNode(entry, options);
  };

  editor.isVoid = (element) => {
    return element.type === "divider";
  };

  return editor;
}
