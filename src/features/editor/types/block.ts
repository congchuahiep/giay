import type { Descendant } from "slate";
import type { CodeBlock } from "./code-block";

export interface BaseBlock {
	id: string;
	type: string;
	children: Descendant[];
}

export interface PageBlock extends BaseBlock {
	type: "page";
	icon: string;
	title: string;
	pageId: string | undefined;
	isDeleted: boolean;
}

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
	| DividerBlock
	| PageBlock;

export type BlockType = ElementBlock["type"];
export * from "./code-block";
