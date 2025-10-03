import {
	ReactEditor,
	useSlateStatic,
	type RenderElementProps,
} from "slate-react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

import type { ChangeEvent } from "react";
import { Transforms } from "slate";
import type {
	CodeBlockLanguage,
	CodeBlock as CodeBlockType,
} from "@/features/editor/types";

const CodeBlock = (props: RenderElementProps) => {
	const editor = useSlateStatic();
	const element = props.element as CodeBlockType;

	const setLanguage = (value: CodeBlockLanguage) => {
		const path = ReactEditor.findPath(editor, element);
		Transforms.setNodes(editor, { language: value }, { at: path });
	};

	return (
		<pre
			className={cn(
				"bg-stone-200/50 dark:bg-neutral-800 px-4 py-6 my-1",
				"overflow-auto text-sm rounded-sm relative",
			)}
			{...props.attributes}
			spellCheck={false}
		>
			<LanguageSelect
				value={element.language || "javascript"}
				onChange={setLanguage}
			/>
			<code spellCheck={false}>{props.children}</code>
		</pre>
	);
};

interface LanguageSelectProps {
	value?: string;
	onChange: (value: CodeBlockLanguage) => void;
}

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils";

const LANGUAGES = [
	{ value: "javascript", label: "JavaScript" },
	{ value: "typescript", label: "TypeScript" },
	{ value: "python", label: "Python" },
	{ value: "jsx", label: "JSX" },
	{ value: "tsx", label: "TSX" },
	{ value: "markdown", label: "Markdown" },
	// ... thêm các ngôn ngữ khác nếu muốn
];

export function LanguageSelect({ value, onChange }: LanguageSelectProps) {
	return (
		<div
			style={{
				position: "absolute",
				right: 4,
				top: 4,
				zIndex: 2,
				minWidth: 120,
			}}
		>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className="w-[120px] max-h-6 text-xs bg-popover">
					<SelectValue placeholder="Ngôn ngữ" />
				</SelectTrigger>
				<SelectContent>
					{LANGUAGES.map((lang) => (
						<SelectItem key={lang.value} value={lang.value}>
							{lang.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

export default CodeBlock;

const prismThemeCss = `
/**
 * prism.js default theme for JavaScript, CSS and HTML
 * Based on dabblet (http://dabblet.com)
 * @author Lea Verou
 */


`;
