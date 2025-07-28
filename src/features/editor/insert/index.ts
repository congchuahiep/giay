import handleEnter from "@/features/editor/insert/handlerEnter";
import insertNumberedList from "@/features/editor/insert/insertNumberedList";
import insertParagraph from "@/features/editor/insert/insertParagraph";
import type InsertEditor from "@/features/editor/insert/inteface";
import type { Editor } from "slate";

export type { InsertEditor };

export function withInsertHandler(editor: Editor): Editor & InsertEditor {
  editor.handleEnter = (event, shift) => handleEnter(editor, event, shift);
  editor.insertParagraph = () => insertParagraph(editor);
  editor.insertNumberedList = () => insertNumberedList(editor);

  return editor;
}
