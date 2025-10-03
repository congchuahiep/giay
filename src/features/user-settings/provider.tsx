// src/features/user-settings/providers/SettingsProvider.tsx
import { useEffect } from "react";
import { useSetting } from "./stores";

interface SettingProviderProps {
	children: React.ReactNode;
}

export default function SettingProvider({ children }: SettingProviderProps) {
	const { init } = useSetting();

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
}
