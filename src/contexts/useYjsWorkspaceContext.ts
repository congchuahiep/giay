import type { HocuspocusProvider } from "@hocuspocus/provider";
import { createContext, useContext } from "react";
import type { PagePreview, Workspace } from "@/types";

interface YjsWorkspace {
	activeWorkspace: Workspace;
	userWorkspaces: Workspace[];
	provider: HocuspocusProvider;
	setActiveWorkspace: (workspaceId: string) => void;
}

export const YjsWorkspaceContext = createContext<YjsWorkspace | undefined>(
	undefined,
);

export const useYjsWorkspaceContext = () => {
	const ctx = useContext(YjsWorkspaceContext);
	if (!ctx)
		throw new Error(
			"useYjsWorkspaceContext must be used within YjsWorkspaceProvider",
		);
	return ctx;
};
