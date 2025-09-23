import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import AppRoute from "@/AppRoute.tsx";
import { SettingsProvider } from "./features/user-settings/providers/SettingProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: right rule ^^
createRoot(document.getElementById("root")!).render(
	// <StrictMode>
	<QueryClientProvider client={queryClient}>
		<SettingsProvider>
			<BrowserRouter>
				<AppRoute />
			</BrowserRouter>
		</SettingsProvider>
	</QueryClientProvider>,
	// </StrictMode>,
);
