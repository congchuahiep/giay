import type { BaseBlock } from "./block";

export type CodeBlockLanguage =
	| "css"
	| "javascript"
	| "typescript"
	| "html"
	| "jsx"
	| "tsx"
	| "java";

export interface CodeBlock extends BaseBlock {
	type: "code";
	language: CodeBlockLanguage;
}
