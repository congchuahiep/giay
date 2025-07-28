import { Editor, Element, Transforms, Path } from "slate";

/**
 * Tạo một paragraph mới, (hành vi mặc định của nhiều block khi nhấn phím enter)
 */
export default function insertParagraph(editor: Editor) {
  const { selection } = editor;

  const [match] = Editor.nodes(editor, {
    match: (n) => !Editor.isEditor(n) && Element.isElement(n),
  });

  if (selection) {
    const [, path] = match;
    const isEnd = Editor.isEnd(editor, selection.anchor, path);

    if (isEnd) {
      Transforms.insertNodes(
        editor,
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
        { at: Path.next(path) }
      );
      Transforms.select(editor, Editor.start(editor, Path.next(path)));
    } else {
      Transforms.splitNodes(editor);
      Transforms.setNodes(editor, { type: "paragraph" });
    }
  }
}
