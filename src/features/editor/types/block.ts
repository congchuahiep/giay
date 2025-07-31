import type { Descendant } from "slate";

// Cập nhật base interface để có id
export interface BaseBlock {
  type: string;
  children: Descendant[];
}

// Cập nhật các block types
export interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
}

export interface HeadingBlock extends BaseBlock {
  type: "h1" | "h2" | "h3" | "h4";
}

export interface BulletListBlock extends BaseBlock {
  type: "bulletList";
}

export interface CheckListBlock extends BaseBlock {
  type: "checkList";
  checked: boolean;
}

export interface CodeBlock extends BaseBlock {
  type: "code";
}

export interface QuoteBlock extends BaseBlock {
  type: "quote";
}

export interface DividerBlock extends BaseBlock {
  type: "divider";
}

// Union type cho tất cả blocks
export type ElementBlock =
  | ParagraphBlock
  | HeadingBlock
  | BulletListBlock
  | CheckListBlock
  | CodeBlock
  | QuoteBlock
  | DividerBlock;
