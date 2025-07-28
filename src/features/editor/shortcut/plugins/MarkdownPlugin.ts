import type { BlockType } from "@/features/editor/types";
import { type ShortcutPlugin } from "../core/ShortcutManager";
import { Element, Range, Editor, Transforms } from "slate";

const MARKDOWN_SHORTCUTS: Record<string, BlockType> = {
  "*": "bulletList",
  "-": "bulletList",
  "+": "bulletList",
  "[]": "checkList",
  "#": "h1",
  "##": "h2",
  "###": "h3",
  "####": "h4",
  "|": "quote",
} as const;

const NUMBERED_LIST_REGEX = /^(\d+)\./;

const MarkdownPlugin: ShortcutPlugin = {
  name: "markdown",
  priority: 80,
  actions: {},
  onKeyDown: (event, editor) => {
    const { selection } = editor;

    if (event.key === " ") {
      if (
        selection &&
        selection.anchor.offset < 5 &&
        Range.isCollapsed(selection)
      ) {
        const [blockEntry, node] = Editor.nodes(editor, {
          match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
        });

        if (blockEntry) {
          const [, path] = blockEntry;
          const start = Editor.start(editor, path);
          const range = { anchor: start, focus: selection.anchor };
          const text = Editor.string(editor, range);

          if (Element.isElement(node) && node.type === "bulletList")
            return false;

          // Kiểm tra numbered list với custom start
          const numberedMatch = text.match(NUMBERED_LIST_REGEX);
          if (numberedMatch) {
            const startIndex = parseInt(numberedMatch[1], 10);
            event.preventDefault();
            Transforms.select(editor, range);
            Transforms.delete(editor);
            Transforms.setNodes(
              editor,
              {
                type: "numberedList",
                startIndex: startIndex,
              },
              {
                match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
              }
            );
            return true;
          }

          // Kiểm tra markdown shortcuts khác
          const shortcut = Object.keys(MARKDOWN_SHORTCUTS).find(
            (key) => text === key
          );

          if (shortcut) {
            event.preventDefault();
            Transforms.select(editor, range);
            Transforms.delete(editor);
            Transforms.setNodes(
              editor,
              { type: MARKDOWN_SHORTCUTS[shortcut] },
              {
                match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
              }
            );
            return true;
          }
        }
      }
    }

    if (event.key === "-") {
      if (
        selection &&
        selection.anchor.offset < 3 &&
        Range.isCollapsed(selection)
      ) {
        const [blockEntry] = Editor.nodes(editor, {
          match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
        });

        if (blockEntry) {
          const [, path] = blockEntry;
          const start = Editor.start(editor, path);
          const text = Editor.string(editor, path);

          console.log(text);

          // Kiểm tra nếu text hiện tại là "--" và user vừa gõ "-" thứ 3
          if (text === "--") {
            event.preventDefault();

            // Xóa text "---"
            const fullRange = {
              anchor: start,
              focus: {
                ...selection.anchor,
                offset: selection.anchor.offset + 1,
              },
            };
            Transforms.select(editor, fullRange);
            Transforms.delete(editor);

            // Tạo divider
            Transforms.setNodes(
              editor,
              { type: "divider" },
              {
                match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
              }
            );

            // Di chuyển con trỏ đến node kế tiếp
            const currentPath = path;
            const nextPath = [currentPath[0] + 1];

            // Kiểm tra nếu có node kế tiếp
            if (Editor.hasPath(editor, nextPath)) {
              // Di chuyển đến đầu node kế tiếp
              const startOfNext = Editor.start(editor, nextPath);
              Transforms.select(editor, startOfNext);
            } else {
              // Tạo paragraph mới và di chuyển con trỏ vào đó
              Transforms.insertNodes(
                editor,
                {
                  type: "paragraph",
                  children: [{ text: "" }],
                },
                { at: nextPath }
              );

              // Di chuyển con trỏ đến paragraph mới
              const startOfNew = Editor.start(editor, nextPath);
              Transforms.select(editor, startOfNew);
            }

            return true;
          }
        }
      }
    }

    return false;
  },
};

export default MarkdownPlugin;
