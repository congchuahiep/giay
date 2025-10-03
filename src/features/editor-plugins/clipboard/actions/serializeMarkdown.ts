import { type Descendant, Element, Node, Text } from "slate";

/**
 * Serialize chỉ text content (không có HTML tags)
 * @param node - Slate node
 * @returns Plain text string
 */
export default function serializeMarkdown(node: Node): string {
	if (Text.isText(node)) {
		return serializeLeafMarkdown(node);
	}

	if (Element.isElement(node)) {
		return serializeBlockMarkdown(node);
	}

	return "";
}

export function serializeLeafMarkdown(node: Text) {
	let text = Node.string(node);

	// Apply formatting marks
	if (node.bold) {
		text = `**${text}**`;
	}
	if (node.italic) {
		text = `*${text}*`;
	}
	if (node.strikeThrough) {
		text = `~~${text}~~`;
	}
	if (node.code) {
		text = `\`${text}\``;
	}

	return text;
}

/**
 * Serialize block thành text content
 * @param element - Element node
 * @returns Plain text string
 */
function serializeBlockMarkdown(element: Element): string {
	// Lấy tất cả các text node
	const children = element.children.map(serializeMarkdown).join("");

	switch (element.type) {
		case "paragraph":
			return `${children} \n`;

		case "h1":
			return `# ${children}\n`;

		case "h2":
			return `## ${children}\n`;

		case "h3":
			return `### ${children}\n`;

		case "h4":
			return `#### ${children}\n`;

		case "bulletList":
			return `- ${children}`;

		case "checkList": {
			const checked = element.checked ? "x" : " ";
			return `- [${checked}] ${children}`;
		}

		case "code":
			return `\`\`\`\n${children}\n\`\`\`\n`;

		case "quote":
			return `> ${children}\n`;

		case "divider":
			return "---\n";

		default:
			return `${children} \n`;
	}
}

/**
 * Serialize nodes thành plain text với line breaks
 * @param nodes - Array of nodes
 * @returns Plain text with line breaks
 */
export function serializeFragmentToMarkdown(fragment: Descendant[]): string {
	return fragment.map(serializeMarkdown).join("\n");
}
