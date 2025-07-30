import { withCursors, withYjs } from "@slate-yjs/core";
import { createEditor, Editor, Transforms, type Descendant } from "slate";
import { withReact } from "slate-react";
import { withHistory } from "slate-history";
import type { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { withUtilsEditor } from "@/features/editor/utils";
import { withSelectEditor } from "@/features/editor/select";
import { withDeleteEditor } from "@/features/editor/delete";
import { withInsertEditor } from "@/features/editor/insert";
import { withFormatEditor } from "@/features/editor/format";
import { withMarkdownEditor } from "@/features/editor/markdown";
import { withSlashEditor } from "@/features/editor/slash-command";

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
    const [node] = entry;
    if (!Editor.isEditor(node) || node.children.length > 0) {
      return normalizeNode(entry, options);
    }
    // Chỉ chèn initialValue nếu sharedType (dữ liệu cộng tác) rỗng
    // if (sharedType.length !== 0) {
    // }
    Transforms.insertNodes(editor, initialValue, { at: [0] });
  };

  editor.isVoid = (element) => {
    return element.type === "divider";
  };

  return editor;
}
