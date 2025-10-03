import type { Editor, Node } from "slate";

export default function insertNodes(
	editor: Editor,
	nodes: Node | Node[],
): Node | Node[] {
	nodes = Array.isArray(nodes) ? nodes : [nodes];
	nodes.map((node) => {
		if ("type" in node && typeof node === "object" && !node.id) {
			return editor.ensureBlockId(node);
		}
		return node;
	});

	return nodes;
}
