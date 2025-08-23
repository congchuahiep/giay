import type { LeafText } from "@/features/editor/types/leaf.ts";
import { Transforms, type Editor } from "slate";
import { jsx } from "slate-hyperscript";

// Định nghĩa mapping cho các HTML tags thành block elements
const ELEMENT_TAGS: Record<
  string,
  (el: HTMLElement) => { type: string; id?: string }
> = {
  P: () => ({ type: "paragraph" }),
  H1: () => ({ type: "h1" }),
  H2: () => ({ type: "h2" }),
  H3: () => ({ type: "h3" }),
  H4: () => ({ type: "h4" }),
  BLOCKQUOTE: () => ({ type: "quote" }),
  PRE: () => ({ type: "code" }),
  UL: (el) => {
    // TODO: Sửa lại logic deserialize checklist và bulletlist
    const listItems = Array.from(el.querySelectorAll("li"));
    const isChecklist = listItems.some((li) => {
      const content = li.textContent || "";
      return isChecklistContent(content);
    });

    return { type: isChecklist ? "checkList" : "bulletList" };
  },
  OL: () => ({ type: "numberList" }),
};

// Định nghĩa mapping cho các text formatting tags
const TEXT_TAGS: Record<string, Partial<LeafText>> = {
  STRONG: { bold: true },
  B: { bold: true },
  EM: { italic: true },
  I: { italic: true },
  U: { underline: true },
  CODE: { code: true },
};

/**
 * Phân giải dữ liệu (html) từ bên ngoài vào, chuyển hoá nội dung đó thành
 * các node/leaf/element/block và chèn chúng vào editor
 *
 * @param editor
 * @param html
 * @returns
 */
export function deserializeHtmlAndInsert(editor: Editor, html: string) {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const fragment = deserializeHtml(editor, parsed.body);

  if (!fragment) return;

  // Vì một vài lý do ngu si nào đó, mặc định `fragment` do jsx xử lý sẽ luôn
  // được gắn thêm hai phần tử sau:
  // - Phần tử đầu của `fragment` là một ký tự "\n"
  // - Phần tử cuối của `fragment` là một ký tự "\n\n"
  // Chính vì thế ta phải loại bỏ hai phần tử này ra >:(
  if (Array.isArray(fragment)) {
    fragment[0] = { text: "" };
    fragment.pop();
  }

  // Xử lý block hiện tại nếu trống
  if (
    editor.getCurrentBlockContent() === "" &&
    editor.getCurrentBlockType() === "paragraph"
  ) {
    editor.removeNodes();
  }

  // Insert fragment và normalize
  Transforms.insertFragment(editor, fragment);
}

/**
 * Phân giải từng HTML Node và biến nó thành các node/leaf/element/block
 *
 * @param editor
 * @param el
 * @param markAttributes
 * @returns
 */
export function deserializeHtml(
  editor: Editor,
  el: Node,
  markAttributes: Partial<LeafText> = {}
): any {
  if (el.nodeType === Node.TEXT_NODE) {
    return el.textContent ? jsx("text", markAttributes, el.textContent) : null;
  }

  if (el.nodeType !== Node.ELEMENT_NODE) return null;

  const element = el as HTMLElement;

  // Kết hợp text formatting attributes
  const textStyle = TEXT_TAGS[element.nodeName];
  const attributes = {
    ...markAttributes,
    ...textStyle,
  };

  // Xử lý các nội dung con của nó
  const children = Array.from(element.childNodes)
    .map((node) => deserializeHtml(editor, node, attributes))
    .flat()
    .filter(Boolean);

  if (children.length === 0) {
    children.push(jsx("text", attributes, ""));
  }

  // Xử lý các trường hợp đặc biệt
  if (element.nodeName === "BODY") {
    return jsx("fragment", {}, children);
  }

  if (element.nodeName === "BR") {
    return "\n";
  }

  if (element.nodeName === "LI") {
    const content = element.textContent || "";

    // Nếu là checklist item
    if (isChecklistContent(content)) {
      const { text } = parseChecklistItem(content);
      return jsx("text", attributes, text);
    }

    return children;
  }

  // Xử lý từng block một
  const elementType = ELEMENT_TAGS[element.nodeName];
  if (elementType) {
    const attrs = {
      ...elementType(element),
      id: editor.generateId(),
    };

    // Xử lý loại check list
    if (attrs.type === "checkList") {
      return children.map((child) => {
        const content = Array.isArray(child) ? child[0].text : child.text;
        if (isChecklistContent(content)) {
          const { checked, text } = parseChecklistItem(content);
          return jsx(
            "element",
            { ...attrs, checked, id: editor.generateId() },
            jsx("text", {}, text)
          );
        }
        // Nếu không phải check list item, tạo một item unchecked
        return jsx(
          "element",
          { ...attrs, checked: false, id: editor.generateId() },
          child
        );
      });
    }

    // Xử lý từng loại list
    if (attrs.type === "bulletList" || attrs.type === "numberList") {
      return children.map((child) => jsx("element", attrs, child));
    }

    // Xử lý mặc định
    return jsx("element", attrs, children);
  }

  return children;
}

/// CÁC XỬ LÝ KHÁC

function isChecklistContent(content: string): boolean {
  return /^\[[ x]\]/.test(content.trim());
}

function parseChecklistItem(content: string): {
  checked: boolean;
  text: string;
} {
  const trimmed = content.trim();
  const checked = trimmed.startsWith("[x]");
  const text = trimmed.replace(/^\[[ x]\]/, "").trim();
  return { checked, text };
}
