import type { NavigateFunction } from "react-router-dom";

export interface PageBlockEditor {
	handleEnterPage: (workspaceId: string, navigate: NavigateFunction) => boolean;

	handleDeletePage: () => boolean;
}
