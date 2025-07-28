import { Node, Range } from "slate";
import { useSelected, useSlate, type RenderElementProps } from "slate-react";
import { LeafPlaceholder } from "../Leaf";

const ParagraphBlock = (props: RenderElementProps) => {
  const isEmpty = Node.string(props.element) === "";
  const isSelected = useSelected();

  const editor = useSlate();
  const selection = editor.selection;
  let isSelectionCollapsed = true;
  if (selection !== null && editor.selection)
    isSelectionCollapsed = Range.isCollapsed(editor.selection);

  return (
    <p className="p-1" {...props.attributes}>
      {isSelected && isSelectionCollapsed && (
        <LeafPlaceholder isEmpty={isEmpty} placeholder="Typing..." />
      )}
      {props.children}
    </p>
  );
};

export default ParagraphBlock;
