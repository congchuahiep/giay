import Prism from "prismjs";
import { Element, Node, type NodeEntry, type Range } from "slate";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
// import "prismjs/components/prism-tsx";
import "prismjs/components/prism-jsx";
// import "prismjs/components/prism-html";

function flattenTokens(tokens: (string | Prism.Token)[], types: string[] = []) {
	const flat: { types: string[]; content: string }[] = [];
	for (const token of tokens) {
		if (typeof token === "string") {
			flat.push({ types: types.length ? types : ["plain"], content: token });
		} else if (typeof token.content === "string") {
			const aliases = token.alias
				? Array.isArray(token.alias)
					? token.alias
					: [token.alias]
				: [];
			flat.push({
				types: [...types, token.type, ...aliases],
				content: token.content,
			});
		} else if (Array.isArray(token.content)) {
			const aliases = token.alias
				? Array.isArray(token.alias)
					? token.alias
					: [token.alias]
				: [];
			flat.push(
				...flattenTokens(token.content, [...types, token.type, ...aliases]),
			);
		}
	}
	return flat;
}

/**
 * Phân tích cú pháp code và trả về các range có thông tin token (màu sắc)
 * @returns
 */
export default function decorateCodeBlock([node, path]: NodeEntry): Range[] {
	if (!Element.isElement(node) || node.type !== "code") return [];

	const text = Node.string(node);
	const language = node.language || "javascript";
	const grammar = Prism.languages[language] || Prism.languages.javascript;
	const tokens = Prism.tokenize(text, grammar);

	const ranges: Range[] = [];
	let start = 0;
	const flatTokens = flattenTokens(tokens);

	for (const { types, content } of flatTokens) {
		// Xử lý xuống dòng trong content
		const lines = content.split(/\r\n|\r|\n/);
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const length = line.length;
			if (length > 0) {
				ranges.push({
					anchor: { path: [...path, 0], offset: start },
					focus: { path: [...path, 0], offset: start + length },
					...Object.fromEntries(types.map((type) => [type, true])),
				});
			}
			start += length;
			if (i < lines.length - 1) {
				// Nếu không phải dòng cuối, nhảy qua ký tự xuống dòng
				start += 1;
			}
		}
	}
	return ranges;
}
