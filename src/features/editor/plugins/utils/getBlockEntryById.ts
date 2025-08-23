import { Editor, Element, Path } from "slate";

export default function getBlockEntryById(editor: Editor, id: string) {
  for (const [node, path] of Editor.nodes(editor, {
    at: [],
    match: (n) => Element.isElement(n) && n.id === id,
  })) {
    return [node, path] as [Element, Path];
  }
  return undefined;
}
