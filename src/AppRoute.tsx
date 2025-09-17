import Layout from "@/Layout";
import EditorWindow from "@/windows/EditorWindow";
import SettingsWindow from "@/windows/SettingsWindow";
import { Route, Routes } from "react-router";

function AppRoute() {

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <EditorWindow />
          </Layout>
        }
      />
      <Route path="/settings" element={<SettingsWindow />} />
    </Routes>
  );
}

export default AppRoute;
