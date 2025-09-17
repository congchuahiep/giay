import { DialogTitle } from "@radix-ui/react-dialog";
import { useMemo } from "react";
import CollaborativeEditor from "@/components/Editor/CollaborativeEditor";
import { SettingPanel } from "@/components/SettingPanel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSidebar } from "@/components/ui/sidebar";
import { useRegisterShortcuts } from "@/core/shortcut";
import { AppNavigationShortcutExtension } from "@/features/navigates";
import { useGlobalModalStore } from "@/stores/modal";

export interface AppContext {
	toggleSidebar: () => void;
	openSettings: () => void;
}

function EditorWindow() {
	const { toggleSidebar } = useSidebar();

	const appShortcutContext = useMemo(
		() => ({
			toggleSidebar,
			openSettings: () => {
				console.log("Open settings!!!!!!!!!!");
				/* open settings logic */
			},
		}),
		[toggleSidebar],
	);

	useRegisterShortcuts("global", appShortcutContext, [
		AppNavigationShortcutExtension,
	]);
	const { open, type, closeModal } = useGlobalModalStore();

	return (
		<main className="w-full">
			{/* EDITOR CONTAINER */}
			<div className="overflow-y-auto overflow-x-hidden mt-12">
				<div className="px-12 m-auto w-full max-w-3xl lg:w-3xl dark:text-white">
					<CollaborativeEditor />
				</div>
			</div>

			<Dialog open={open} onOpenChange={closeModal}>
				<DialogContent
					showCloseButton
					className="max-h-[540px] p-0 min-w-[720px] overflow-hidden"
				>
					<DialogTitle className="sr-only">Settings</DialogTitle>
					{type === "settings" && <SettingPanel />}
					{/* Thêm các modal khác nếu cần */}
				</DialogContent>
			</Dialog>
		</main>
	);
}

// md:w-3xl
// lg:w-5xl

export default EditorWindow;
