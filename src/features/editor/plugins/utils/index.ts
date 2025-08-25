import buildBlock from "@/features/editor/plugins/utils/buildBlock.ts";
import DefaultBehaviourShortCutExtension from "@/features/editor/plugins/utils/DefaultBehaviourShortcutExtension.ts";
import ensureBlockId from "@/features/editor/plugins/utils/ensureBlockId.ts";
import getBlockByid from "@/features/editor/plugins/utils/getBlockById.ts";
import getBlockContentById from "@/features/editor/plugins/utils/getBlockContentById.ts";
import getBlockEntryById from "@/features/editor/plugins/utils/getBlockEntryById.ts";
import getBlockPathById from "@/features/editor/plugins/utils/getBlockPathById.ts";
import getCurrentBlock from "@/features/editor/plugins/utils/getCurrentBlock.ts";
import getCurrentBlockContent from "@/features/editor/plugins/utils/getCurrentBlockContent.ts";
import getCurrentBlockEntry from "@/features/editor/plugins/utils/getCurrentBlockEntry.ts";
import getCurrentBlockPath from "@/features/editor/plugins/utils/getCurrentBlockPath.ts";
import getLastBlock from "@/features/editor/plugins/utils/getLastBlock.ts";
import getLastBlockEntry from "@/features/editor/plugins/utils/getLastBlockEntry.ts";
import getLastBlockPath from "@/features/editor/plugins/utils/getLastBlockPath.ts";
import type UtilsEditor from "@/features/editor/plugins/utils/interface.ts";
import { Editor } from "slate";
import { v4 as uuidv4 } from "uuid";
import getCurrentBlockType from "./getCurrentBlockType.ts";
import isCurrentBlockEmpty from "./isCurrentBlockEmpty.ts";

export { DefaultBehaviourShortCutExtension };
export type { UtilsEditor };

/**
 * Plugin này chung cấp các phương thức tiện ích cho editor, mục đích của
 * các phương thức này là cho phép các phương thức của các plugin khác được
 * sử dụng chung
 *
 * Sử dụng: `editor.<tên tiện ích>`
 */
export function withUtilsEditor(editor: Editor): Editor & UtilsEditor {
  editor.buildBlock = (additionalProps) => buildBlock(editor, additionalProps);
  editor.generateId = () => uuidv4();
  editor.ensureBlockId = (block) => ensureBlockId(block);

  editor.getBlockById = (id) => getBlockByid(editor, id);
  editor.getBlockEntryById = (id) => getBlockEntryById(editor, id);
  editor.getBlockPathById = (id) => getBlockPathById(editor, id);
  editor.getBlockContentById = (id) => getBlockContentById(editor, id);

  editor.getCurrentBlock = () => getCurrentBlock(editor);
  editor.getCurrentBlockEntry = () => getCurrentBlockEntry(editor);
  editor.getCurrentBlockPath = () => getCurrentBlockPath(editor);
  editor.getCurrentBlockType = () => getCurrentBlockType(editor);
  editor.getCurrentBlockContent = () => getCurrentBlockContent(editor);

  editor.getLastBlock = () => getLastBlock(editor);
  editor.getLastBlockEntry = () => getLastBlockEntry(editor);
  editor.getLastBlockPath = () => getLastBlockPath(editor);

  editor.isCurrentBlockEmpty = () => isCurrentBlockEmpty(editor);

  return editor;
}
