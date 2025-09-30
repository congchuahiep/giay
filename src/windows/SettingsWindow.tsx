import SettingPanel from "@/components/SettingPanel/SettingPanel";
import { isTauri } from "@tauri-apps/api/core";

const SettingsWindow = () => {
  if (isTauri()) {
    // Tauri: render full page (cửa sổ riêng)
    return <SettingPanel />;
  }
  // Web: render dialog/modal
  return <SettingPanel />;
};

export default SettingsWindow;
