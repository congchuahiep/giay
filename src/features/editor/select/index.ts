import expandSelectionToFullBlocks from "@/features/editor/select/expandSelectionToFullBlocks";
import type SelectEditor from "@/features/editor/select/inteface";
import isSelectAllBlock from "@/features/editor/select/isSelectAllBlock";
import isSelectFullBlock from "@/features/editor/select/isSelectFullblock";
import type { Editor } from "slate";

export type { SelectEditor };

export function withSelectHandler(editor: Editor): Editor & SelectEditor {
  editor.expandSelectionToFullBlocks = (event) =>
    expandSelectionToFullBlocks(editor, event);

  editor.isSelectFullBlock = () => isSelectFullBlock(editor);
  editor.isSelectAllBlock = () => isSelectAllBlock(editor);

  return editor;
}
