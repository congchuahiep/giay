import type { Hotkeys } from "@/features/shortcut";

export default interface UserSetting {
	theme: string;
	fontSize: number;
	hotkeys: Record<string, Hotkeys>;
}
