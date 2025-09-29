import type { NavigateFunction } from "react-router-dom";
import type { Editor } from "slate";

export interface PageBlockEditor {
	handleEnterPage: (
		editor: Editor,
		workspaceId: string,
		navigate: NavigateFunction,
	) => boolean;
}
