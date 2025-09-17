import { useShortcutStore, type Hotkeys } from "@/core/shortcut";
import { useSettingsStore } from "../stores/useSettingsStore";
import { useEffect, useState } from "react";

export const useShortcutConfig = () => {
  const { hotkeys: shortcuts } = useSettingsStore((state) => state.settings);
  const { updateHotkey, getExtensions } = useShortcutStore((state) => ({
    updateHotkey: state.updateHotkey,
    getExtensions: state.getExtensions,
  }));
  const [flattenHotkey, setFlattenHotkey] = useState<Hotkeys>({});

  useEffect(() => {
    if (!shortcuts) return;

    setFlattenHotkey(() => ({
      ...shortcuts["mark"],
      ...shortcuts["format"],
      ...shortcuts["markdown"],
      ...shortcuts["default-behaviour"],
      ...shortcuts["slash-menu"],
      ...shortcuts["open-slash-menu"],
      ...shortcuts["app-navigation"],
    }));

    const extensions = getExtensions();
    extensions.forEach((extension) => {
      if (shortcuts[extension.name]) {
        // Cập nhật keySettings cho extension này
        updateHotkey(extension.name, shortcuts[extension.name]);
      }
    });
  }, [shortcuts, getExtensions, updateHotkey]);

  return {
    shortcuts,
    flattenHotkey,
    updateHotkey,
  };
};
