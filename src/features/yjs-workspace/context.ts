import { createContext } from "react";
import type { createYjsWorkspaceStore } from "./store";

export const YjsWorkspaceContext = createContext<ReturnType<
	typeof createYjsWorkspaceStore
> | null>(null);
