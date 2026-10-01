import { createContext } from "react";
import type { Theme } from "./types";

type ThemeProviderState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState>({
	theme: "system",
	setTheme: () => null,
});

export default ThemeProviderContext;
