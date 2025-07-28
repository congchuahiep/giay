import type { ElementBlock } from "@/features/editor/types/block";
import { Editor, Transforms } from "slate";

// TODO: Cần chỉnh sửa lại cách paste parse dữ liệu
export function insertTextAsBlocks(editor: Editor, text: string) {
  // Tách block dựa trên 2+ dấu xuống dòng
  const blocks = text
    .split(/\n{1,}/)
    .map((line) => line.trim())
    .filter(Boolean);

  const nodes = blocks.map((blockText) => {
    let type = "paragraph";
    let content = blockText;

    if (blockText.startsWith("# ")) {
      type = "h1";
      content = blockText.replace(/^# +/, "");
    } else if (blockText.startsWith("## ")) {
      type = "h2";
      content = blockText.replace(/^## +/, "");
    } else if (blockText.startsWith("### ")) {
      type = "h3";
      content = blockText.replace(/^### +/, "");
    } else if (blockText.startsWith("#### ")) {
      type = "h4";
      content = blockText.replace(/^#### +/, "");
    }
    // Mở rộng thêm ở đây...

    return {
      type,
      children: [{ text: content }],
    };
  }) as ElementBlock[];

  if (nodes.length > 0) {
    editor.removeNodes();
    Transforms.insertNodes(editor, nodes);
  }
}
