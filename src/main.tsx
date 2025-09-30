// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import AppRoute from "@/AppRoute.tsx";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/ui/theme-provider";
import { SettingsProvider } from "./features/user-settings/providers/SettingProvider";

const queryClient = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: right rule ^^
createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	<QueryClientProvider client={queryClient}>
		<SettingsProvider>
			<ThemeProvider storageKey="theme">
				<BrowserRouter>
					<AppRoute />
				</BrowserRouter>
				<Toaster />
			</ThemeProvider>
		</SettingsProvider>
	</QueryClientProvider>,
	// </StrictMode>,
);
