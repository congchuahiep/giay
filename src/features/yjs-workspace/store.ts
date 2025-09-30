import _ from "lodash";
import { createStore } from "zustand";
import type { YjsWorkspaceProps, YjsWorkspaceState } from "./types";

export const createYjsWorkspaceStore = (initialData: YjsWorkspaceProps) => {
	return createStore<YjsWorkspaceState>()((set, get) => ({
		...initialData,

		/**
		 * Kết nối workspace
		 */
		connect: (workspaceId: string) => {
			const { userWorkspaces, setActiveWorkspace } = get();

			const workspace = _.chain(userWorkspaces)
				.find((workspace) => workspace.id === workspaceId)
				.value();

			setActiveWorkspace(workspace);

			set({
				activeWorkspace: workspace,
				status: "connecting",
			});
		},
	}));
};
