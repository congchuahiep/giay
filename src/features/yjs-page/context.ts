import { createContext } from "react";
import type { createYjsPageStore } from "./store";

export const YjsPageContext = createContext<ReturnType<
	typeof createYjsPageStore
> | null>(null);
