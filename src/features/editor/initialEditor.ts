import { composePlugins, type Plugin } from "@/features/editor/composePlugins";
import { withCursors, withYjs } from "@slate-yjs/core";
import {
  createEditor,
  Editor,
  Element,
  Transforms,
  type Descendant,
} from "slate";
import type { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

/**
 * Khởi tạo editor, có chế độ cộng tác
 *
 * @param sharedType
 * @param provider
 * @param initialValue
 * @returns
 */
export default function initialEditor(
  plugins: Plugin<Editor>[],
  sharedType: Y.XmlText,
  provider: WebsocketProvider,
  initialValue: Descendant[]
) {
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

  // Khởi tạo editor với danh sách các plugin
  const editor = withCursors(
    withYjs(composePlugins(createEditor(), plugins), sharedType),
    provider.awareness,
    { data: { name, color } }
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
