import { Editor, Element, Transforms, Path } from "slate";


/**
 * Chèn một danh sách đánh số vào vị trí hiện tại của con trỏ trong editor.
 * Nếu con trỏ ở cuối phần tử, sẽ chèn một danh sách mới; nếu không, sẽ tách và chuyển đổi phần tử hiện tại thành danh sách đánh số.
 *
 * @param editor Editor Slate để thao tác.
 */
export default function insertNumberedList(editor: Editor) {
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
          type: "numberedList",
          startIndex: undefined,
          children: [{ text: "" }],
        },
        { at: Path.next(path) }
      );
      Transforms.select(editor, Editor.start(editor, Path.next(path)));
    } else {
      Transforms.splitNodes(editor);
      Transforms.setNodes(editor, {
        type: "numberedList",
        startIndex: undefined,
      });
    }
  }
}
