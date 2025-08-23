import expandSelectionToFullBlocks from "@/features/editor/plugins/select/expandSelectionToFullBlocks";
import type SelectEditor from "@/features/editor/plugins/select/inteface";
import isSelectAllBlock from "@/features/editor/plugins/select/isSelectAllBlock";
import isSelectFullBlock from "@/features/editor/plugins/select/isSelectFullblock";
import type { Editor } from "slate";

export type { SelectEditor };

export function withSelectEditor(editor: Editor): Editor & SelectEditor {
  editor.expandSelectionToFullBlocks = (event) =>
    expandSelectionToFullBlocks(editor, event);

  editor.isSelectFullBlock = () => isSelectFullBlock(editor);
  editor.isSelectAllBlock = () => isSelectAllBlock(editor);

  return editor;
}
