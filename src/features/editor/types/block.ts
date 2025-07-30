import type { LeafText } from "./leaf";

export type BlockType = ElementBlock["type"];

export type ElementBlock =
  | ParagraphType
  | CodeType
  | Heading1Type
  | Heading2Type
  | Heading3Type
  | Heading4Type
  | BulletListType
  // | NumberedListType
  | CheckListType
  | DividerType
  | QuoteType;

export type ParagraphType = {
  type: "paragraph";
  children: LeafText[];
};

export type Heading1Type = {
  type: "h1";
  children: LeafText[];
};

export type Heading2Type = {
  type: "h2";
  children: LeafText[];
};

export type Heading3Type = {
  type: "h3";
  children: LeafText[];
};

export type Heading4Type = {
  type: "h4";
  children: LeafText[];
};

export type BulletListType = {
  type: "bulletList";
  children: LeafText[];
};

// export type NumberedListType = {
//   type: "numberedList";
//   startIndex?: number;
//   children: LeafText[];
// };

export type CheckListType = {
  type: "checkList";
  checked: false;
  children: LeafText[];
};

export type CodeType = {
  type: "code";
  children: LeafText[];
};

export type DividerType = {
  type: "divider";
  children: [{ text: "" }];
};

export type QuoteType = {
  type: "quote";
  children: LeafText[];
};
