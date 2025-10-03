import { Route, Routes } from "react-router";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { EditorLayout } from "@/layouts";
import { EditorWindow, LoginWindow, SettingsWindow } from "@/windows";

function AppRoute() {
	return (
		<Routes>
			<Route path="/login" element={<LoginWindow />} />
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<EditorLayout />
					</ProtectedRoute>
				}
			>
				<Route index element={<EditorWindow />} />
				<Route path=":workspaceId/:pageId" element={<EditorWindow />} />
			</Route>
			<Route
				path="settings"
				element={
					<ProtectedRoute>
						<SettingsWindow />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}

export default AppRoute;
