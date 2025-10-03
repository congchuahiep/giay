import type { BlockType } from "@/features/editor/types";

const MARKDOWN_MAP: Record<string, BlockType> = {
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

export default MARKDOWN_MAP;
