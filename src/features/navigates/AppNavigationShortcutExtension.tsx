import type { ShortcutExtension } from "@/core/shortcut";
import { openSettingsWindow } from "@/features/navigates";
import type { AppContext } from "@/windows/EditorWindow";

const AppNavigationShortcutExtension: ShortcutExtension<AppContext> = {
	name: "app-navigation",
	scope: "global",
	priority: 0,
	actions: {
		"toggle-sidebar": (event, context) => {
			event.preventDefault();
			context.toggleSidebar();
			return true;
		},
		"open-settings": (event) => {
			event.preventDefault();
			openSettingsWindow();
			return true;
		},
	},
};

export default AppNavigationShortcutExtension;
