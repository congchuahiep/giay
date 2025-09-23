import { HocuspocusProvider } from "@hocuspocus/provider";
import _ from "lodash";
import { useMemo, useState } from "react";
import { YjsWorkspaceContext } from "@/contexts/useYjsWorkspaceContext";
import type { Workspace } from "@/types";

interface YjsWorkspaceProviderProps {
	websocketUrl: string;
	workspace: Workspace;
	userWorkspaces: Workspace[];
	children: React.ReactNode;
}

export default function YjsWorkspaceProvider({
	websocketUrl,
	workspace,
	userWorkspaces,
	children,
}: YjsWorkspaceProviderProps) {
	const [activeWorkspace, setActiveWorkspace] = useState(workspace);

	const provider = useMemo(
		() =>
			new HocuspocusProvider({
				url: websocketUrl,
				name: activeWorkspace.id,
			}),
		[websocketUrl, activeWorkspace],
	);

	const handleSetWorkspace = (workspaceId: string) => {
		const workspace = _.chain(userWorkspaces)
			.find((workspace) => workspace.id === workspaceId)
			.value();

		setActiveWorkspace(workspace);
	};

	return (
		<YjsWorkspaceContext.Provider
			value={{
				activeWorkspace: activeWorkspace,
				userWorkspaces,
				provider,
				setActiveWorkspace: handleSetWorkspace,
			}}
		>
			{children}
		</YjsWorkspaceContext.Provider>
	);
}
