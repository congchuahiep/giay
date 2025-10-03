import { useCallback } from "react";
import { Editor } from "slate";
import {
	deserializeHtmlAndInsert,
	deserializerMarkdownAndInsert,
} from "./actions";
import { serializeFragmentHtml } from "./actions/serializeHtml";
import { serializeFragmentToMarkdown } from "./actions/serializeMarkdown";

/**
 * TODO: GHII
 * @param editor
 * @returns
 */
export function useClipboard(editor: Editor) {
	const handlePaste = useCallback(
		(event: React.ClipboardEvent) => {
			const plainText = event.clipboardData.getData("text/plain");
			const htmlText = event.clipboardData.getData("text/html");

			if (htmlText) {
				event.preventDefault();
				deserializeHtmlAndInsert(editor, htmlText);
				return;
			}

			if (plainText) {
				console.log("whut?");
				const hasMultipleLines = plainText.includes("\n");
				const hasMarkdownSyntax = /^(#{1,4}|\-|\*|>|```|\-\-\-|\*\*\*)/.test(
					plainText.trim(),
				);

				if (hasMultipleLines || hasMarkdownSyntax) {
					event.preventDefault();
					deserializerMarkdownAndInsert(editor, plainText);
					return;
				}
			}

			console.log("whut?");
			// Để Slate xử lý default (KHÔNG ĐƯỢCCCCC! PHẢI NGĂN CHẶN VIỆC NÀY)
		},
		[editor],
	);

	const handleCopy = useCallback(
		(event: React.ClipboardEvent) => {
			const { selection } = editor;

			if (selection) {
				const fragment = Editor.fragment(editor, selection);

				event.preventDefault();
				// Set HTML data
				const html = serializeFragmentHtml(fragment);
				event.clipboardData.setData("text/html", html);

				// Set plain text data
				const text = serializeFragmentToMarkdown(fragment);
				event.clipboardData.setData("text/plain", text);
			}
		},
		[editor],
	);

	return [handlePaste, handleCopy];
}
