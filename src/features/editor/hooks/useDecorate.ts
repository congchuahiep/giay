import { useCallback } from "react";
import { Element, type NodeEntry } from "slate";
import { decorateCodeBlock } from "../plugins/code-block";

/**
 * Sử dụng decorater:
 * - Highlight code syntax
 */
export default function useDecorate() {
	return useCallback(([node, path]: NodeEntry) => {
		if (Element.isElement(node) && node.type === "code") {
			return decorateCodeBlock([node, path]);
		}

		return [];
	}, []);
}
