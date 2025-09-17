import { useGlobalModalStore } from "@/stores/modal";
import { isTauri } from "@tauri-apps/api/core";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Effect } from "@tauri-apps/api/window";

export default async function openSettingsWindow() {
  // Web: Mở modal
  if (!isTauri()) {
    useGlobalModalStore.getState().openModal("settings");
    return;
  }

  // App: Mở window mới
  try {
    const existingWindow = await WebviewWindow.getByLabel("settings-window");
    if (existingWindow) {
      existingWindow.setFocus();
      return;
    }
  } catch {
    // Không tìm thấy window, sẽ tạo mới bên dưới
  }

  const settingsWindow = new WebviewWindow("settings-window", {
    url: "/settings",
    title: "Settings",
    width: 800,
    height: 600,
    center: true,
    resizable: true,
    decorations: false,
    focus: true,
    windowEffects: {
      effects: [Effect.Mica],
    },
    transparent: true,
    alwaysOnTop: false,
    skipTaskbar: false,
  });

  settingsWindow.once("tauri://created", () => {
    console.log("Settings window successfully created");
  });

  settingsWindow.once("tauri://destroyed", () => {
    console.log("Settings window destroyed");
  });

  settingsWindow.once("tauri://error", (e) => {
    console.error("Error creating settings window:", e);
  });
}
