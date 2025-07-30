import handleEnter from "@/features/editor/insert/handlerEnter";
// import insertNumberedList from "@/features/editor/insert/insertNumberedList";
import handleAppendParagraph from "@/features/editor/insert/handleAppendParagraph";
import type InsertEditor from "@/features/editor/insert/inteface";
import type { Editor } from "slate";
import insertBlock from "@/features/editor/insert/insertBlock";

export type { InsertEditor };

export function withInsertEditor(editor: Editor): Editor & InsertEditor {
  editor.handleEnter = (event, shift) => handleEnter(editor, event, shift);
  editor.handleAppendParagraph = () => handleAppendParagraph(editor);
  editor.insertBlock = (blockType) => insertBlock(editor, blockType);
  // editor.insertNumberedList = () => insertNumberedList(editor);

  return editor;
}
