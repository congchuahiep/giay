// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import AppRoute from "@/app-route";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SettingProvider } from "@/features/user-settings";

const queryClient = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: right rule ^^
createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	<QueryClientProvider client={queryClient}>
		<SettingProvider>
			<ThemeProvider storageKey="theme">
				<BrowserRouter>
					<AppRoute />
				</BrowserRouter>
				<Toaster />
			</ThemeProvider>
		</SettingProvider>
	</QueryClientProvider>,
	// </StrictMode>,
);
