import { useEffect, useState } from "react";
import ThemeProviderContext from "./context";
import type { Theme } from "./types";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

export default function SchemaProvider({
	children,
	defaultTheme = "system",
	storageKey = "theme-schema",
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(
		() => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
	);

	useEffect(() => {
		const root = window.document.documentElement;

		const applyTheme = (resolvedTheme: "light" | "dark") => {
			root.classList.remove("light", "dark");
			root.classList.add(resolvedTheme);
		};

		if (theme === "system") {
			const media = window.matchMedia("(prefers-color-scheme: dark)");

			const applySystemTheme = () =>
				applyTheme(media.matches ? "dark" : "light");

			applySystemTheme();
			media.addEventListener("change", applySystemTheme);

			return () => media.removeEventListener("change", applySystemTheme);
		}

		applyTheme(theme);
	}, [theme]);

	const value = {
		theme,
		setTheme: (theme: Theme) => {
			localStorage.setItem(storageKey, theme);
			setTheme(theme);
		},
	};

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}
