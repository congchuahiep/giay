import { Route, Routes } from "react-router";
import Layout from "@/Layout";
import EditorWindow from "@/windows/EditorWindow";
import SettingsWindow from "@/windows/SettingsWindow";
import LoginWindow from "./windows/LoginWindow";
import ProtectedRoute from "./components/ProtectedRoute";

function AppRoute() {
	return (
		<Routes>
			<Route path="/login" element={<LoginWindow />} />
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<Layout />
					</ProtectedRoute>
				}
			>
				<Route
					index
					element={
						<ProtectedRoute>
							<EditorWindow />
						</ProtectedRoute>
					}
				/>
				<Route
					path=":workspaceId/:pageId"
					element={
						<ProtectedRoute>
							<EditorWindow />
						</ProtectedRoute>
					}
				/>
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
