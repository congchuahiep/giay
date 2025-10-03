import { Editor, Element, Node } from "slate";

export default function isCurrentBlockEmpty(editor: Editor): boolean {
  const block = editor.getCurrentBlock();

  if (block && Element.isElement(block)) {
    const text = Node.string(block);
    return text.trim() === ""; // trim() để bỏ khoảng trắng đầu cuối
  }

  return false;
}
