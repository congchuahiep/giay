// src/features/user-settings/providers/SettingsProvider.tsx
import { useEffect } from "react";
import { useSettingsStore } from "../stores/useSettingsStore";

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { init } = useSettingsStore();

  useEffect(() => {
    // Khởi tạo cài đặt và trả về hàm dọn dẹp
    let unsubscribe: (() => void) | undefined;

    init().then((cleanup) => {
      unsubscribe = cleanup;
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [init]);

  return <>{children}</>;
};
