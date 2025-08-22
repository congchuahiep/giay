import type UtilsEditor from "@/features/editor/utils/interface";
import { Editor, Element, type Path } from "slate";
import getCurrentBlockType from "./getCurrentBlockType";
import isCurrentBlockEmpty from "./isCurrentBlockEmpty";
import getCurrentBlockEntry from "@/features/editor/utils/getCurrentBlockEntry";
import getCurrentBlock from "@/features/editor/utils/getCurrentBlock";
import getCurrentBlockPath from "@/features/editor/utils/getCurrentBlockPath";
import buildBlock from "@/features/editor/utils/buildBlock";
import ensureBlockId from "@/features/editor/utils/ensureBlockId";
import { v4 as uuidv4 } from "uuid";
import getCurrentBlockContent from "@/features/editor/utils/getCurrentBlockContent";

export type { UtilsEditor };

/**
 * Plugin này chung cấp các phương thức ưtiện ích cho editor, mục đích của
 * các phương thức này là cho phép các phương thức của các plugin khác được
 * sử dụng chung
 *
 * Sử dụng: `editor.<tên tiện ích>`
 */
export function withUtilsEditor(editor: Editor): Editor & UtilsEditor {
  editor.buildBlock = (blockType, additionalProps) =>
    buildBlock(editor, blockType, additionalProps);
  editor.generateId = () => uuidv4();
  editor.ensureBlockId = (block) => ensureBlockId(block);
  editor.getCurrentBlock = () => getCurrentBlock(editor);
  editor.getCurrentBlockEntry = () => getCurrentBlockEntry(editor);
  editor.getCurrentBlockPath = () => getCurrentBlockPath(editor);
  editor.getCurrentBlockType = () => getCurrentBlockType(editor);
  editor.isCurrentBlockEmpty = () => isCurrentBlockEmpty(editor);
  editor.getCurrentBlockContent = () => getCurrentBlockContent(editor);

  editor.getBlockEntryById = (id: string) => {
    for (const [node, path] of Editor.nodes(editor, {
      at: [],
      match: (n) => Element.isElement(n) && n.id === id,
    })) {
      return [node, path] as [Element, Path];
    }
    return null;
  };

  return editor;
}
