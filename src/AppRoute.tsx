import { Route, Routes } from "react-router";
import EditorLayout from "@/EditorLayout";
import { EditorWindow, LoginWindow, SettingsWindow } from "@/windows";
import ProtectedRoute from "./components/ProtectedRoute";

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
