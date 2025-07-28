import type { Descendant } from "slate";

export function saveContentToLocal(value: Descendant[]) {
	localStorage.setItem("content", JSON.stringify(value));
}

export function loadContentFromLocal(): Descendant[] | null {
	const stored = localStorage.getItem("content");
	return stored ? JSON.parse(stored) : null;
}
