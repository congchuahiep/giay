import { Route, Routes } from "react-router";
import Layout from "@/Layout";
import EditorWindow from "@/windows/EditorWindow";
import SettingsWindow from "@/windows/SettingsWindow";

function AppRoute() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route index element={<EditorWindow />} />
				<Route path=":workspaceId/:pageId" element={<EditorWindow />} />
			</Route>
			<Route path="settings" element={<SettingsWindow />} />
		</Routes>
	);
}

export default AppRoute;
