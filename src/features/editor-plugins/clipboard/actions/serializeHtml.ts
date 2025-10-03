import { type Descendant, Element, type Node, Text } from "slate";

/**
 * Serialize một Slate node thành HTML string
 * @param node - Slate node cần serialize
 * @returns HTML string
 */

export default function serializeHtml(node: Node): string {
	if (Text.isText(node)) {
		return serializeLeafHtml(node);
	}

	if (Element.isElement(node)) {
		return serializeBlockHtml(node);
	}

	return "";
}

/**
 * Serialize text node với các formatting marks
 * @param node - Text node
 * @returns HTML string với formatting
 */
function serializeLeafHtml(node: Text): string {
	let text = escapeHtml(node.text);

	// Apply formatting marks
	if (node.bold) {
		text = `<strong>${text}</strong>`;
	}
	if (node.italic) {
		text = `<em>${text}</em>`;
	}
	if (node.underline) {
		text = `<u>${text}</u>`;
	}
	if (node.strikeThrough) {
		text = `<s>${text}</s>`;
	}
	if (node.code) {
		text = `<code>${text}</code>`;
	}

	return text;
}

/**
 * Serialize block thành HTML
 * @param element - Element node
 * @returns HTML string
 */
function serializeBlockHtml(element: Element): string {
	// Lấy tất cả các text node
	const children = element.children.map(serializeHtml).join("");

	switch (element.type) {
		case "paragraph":
			return `<p>${children}</p>`;

		case "h1":
			return `<h1>${children}</h1>`;

		case "h2":
			return `<h2>${children}</h2>`;

		case "h3":
			return `<h3>${children}</h3>`;

		case "h4":
			return `<h4>${children}</h4>`;

		case "bulletList":
			return `<li>${children}</li>`;

		case "checkList": {
			const checked = element.checked ? "x" : " ";
			return `<li>[${checked}] ${children}</li>`;
		}

		case "code":
			return `<pre><code>${children}</code></pre>`;

		case "quote":
			return `<blockquote><p>${children}</p></blockquote>`;

		case "divider":
			return "<hr>";

		default:
			return `<div>${children}</div>`;
	}
}
/**
 * Serialize toàn bộ editor content thành complete HTML document
 * @param nodes - Array of top-level nodes
 * @returns Complete HTML string
 */

export function serializeFragmentHtml(fragment: Descendant[]): string {
	const body = fragment.map(serializeHtml).join("");

	// Wrap bullet lists và check lists trong ul/ol tags
	const wrappedBody = wrapListItems(body);

	return wrappedBody;
}
/**
 * Wrap consecutive list items trong appropriate list containers
 * @param html - HTML string
 * @returns HTML with proper list wrapping
 */

export function wrapListItems(html: string): string {
	// Wrap bullet list items
	html = html.replace(
		/(<li>(?:(?!<li>|<li><input)[\s\S])*?<\/li>\s*)+/g,
		"<ul>$&</ul>",
	);

	// Wrap check list items
	html = html.replace(
		/(<li><input type="checkbox"[\s\S]*?<\/li>\s*)+/g,
		'<ul class="checklist">$&</ul>',
	);

	return html;
}
/**
 * Escape HTML special characters
 * @param text - Plain text
 * @returns Escaped HTML text
 */
function escapeHtml(text: string): string {
	const div = document.createElement("div");
	div.textContent = text;
	return div.innerHTML;
}
