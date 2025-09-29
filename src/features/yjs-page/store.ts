import { createStore } from "zustand";
import type { YjsPageProps, YjsPageState } from "./types";

export const createYjsPageStore = (initialData: YjsPageProps) => {
	return createStore<YjsPageState>()((set, get) => ({
		...initialData,
	}));
};
