import { ArrowsClockwiseIcon } from "@phosphor-icons/react/dist/csr/ArrowsClockwise";
import { KeyboardIcon } from "@phosphor-icons/react/dist/csr/Keyboard";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Hotkeys, ShortcutType } from "@/features/shortcut";
import { useSetting } from "../..";

const editorShortcut = {
	mark: {
		title: "Text Formatting",
		description: "Shortcuts for text formatting actions.",
		actions: [
			{
				action: "mark-bold",
				title: "Bold",
				description: "Make the selected text bold.",
				defaultHotkey: "mod+b",
			},
			{
				action: "mark-italic",
				title: "Italic",
				description: "Make the selected text italic.",
				defaultHotkey: "mod+i",
			},
			{
				action: "mark-underline",
				title: "Underline",
				description: "Underline the selected text.",
				defaultHotkey: "mod+u",
			},
			{
				action: "mark-code",
				title: "Code",
				description: "Format the selected text as code.",
				defaultHotkey: "mod+e",
			},
			{
				action: "mark-strike-through",
				title: "Strike Through",
				description: "Strike through the selected text.",
				defaultHotkey: "mod+shift+x",
			},
		],
	},
};

export default function KeyboardShortcutSettings() {
	const { getSetting, updateHotkey } = useSetting();

	const {
		data: shortcuts,
		isError,
		error,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ["keyboard-shortcuts"],
		queryFn: async () => await getSetting<Record<string, Hotkeys>>("hotkeys"),
	});

	// State để theo dõi phím tắt nào đang được chỉnh sửa
	const [listeningState, setListeningState] = useState<{
		isListening: boolean;
		extensionName: ShortcutType;
		action: string;
		keys: string[];
	} | null>(null);

	// Xử lý nhấn nút để bắt đầu lắng nghe phím tắt
	const startListening = (extensionName: ShortcutType, action: string) => {
		setListeningState({
			isListening: true,
			extensionName,
			action,
			keys: [],
		});
	};

	// Xử lý khi người dùng nhấn phím
	useEffect(() => {
		if (!listeningState?.isListening) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			e.preventDefault();
			e.stopPropagation();

			// Không theo dõi phím modifier độc lập
			if (["Control", "Alt", "Shift", "Meta"].includes(e.key)) return;

			// Tạo mảng các modifier đang được nhấn
			const modifiers = [];
			if (e.ctrlKey || e.metaKey) modifiers.push("mod");
			if (e.shiftKey) modifiers.push("shift");
			if (e.altKey) modifiers.push("alt");

			// Định dạng phím chính
			let mainKey = e.key.toLowerCase();
			if (mainKey === " ") mainKey = "space";
			if (mainKey === "escape") {
				// Thoát chế độ lắng nghe nếu nhấn Escape
				setListeningState(null);
				return;
			}

			// Kết hợp modifier và phím chính
			const keys = [...modifiers, mainKey];

			// Cập nhật state với phím mới
			setListeningState((prev) => ({
				...prev!,
				keys,
			}));

			// Tự động lưu phím tắt sau một khoảng thời gian ngắn
			setTimeout(async () => {
				if (listeningState) {
					const { extensionName, action } = listeningState;
					const hotkeyString = keys.join("+");
					console.log("Updating hotkey:", {
						extensionName,
						action,
						hotkeyString,
					});

					await updateHotkey("editor", hotkeyString, action);
					await refetch();
					setListeningState(null);
				}
			}, 500);
		};

		// Thêm event listener cho keydown
		window.addEventListener("keydown", handleKeyDown);

		// Thiết lập timeout để thoát chế độ lắng nghe nếu không có tương tác
		const timeoutId = setTimeout(() => {
			setListeningState(null);
		}, 5000); // Thoát sau 5 giây nếu không có tương tác

		// Clean up
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			clearTimeout(timeoutId);
		};
	}, [listeningState, updateHotkey, refetch]);

	// Format phím tắt để hiển thị
	const formatHotkey = (keys: string[]) => {
		return keys.join("+");
	};

	// Reset tất cả phím tắt về mặc định
	// const resetAllShortcuts = () => {
	//   // Implement reset functionality
	// };

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || shortcuts === undefined) {
		return <div>Error: {error?.message}</div>;
	}

	return (
		<div className="overflow-auto w-full">
			<div>
				<h3 className="text-xl font-bold tracking-tight">Keyboard Shortcuts</h3>
				<p className="text-muted-foreground">
					Customize keyboard shortcuts for a faster workflow.
				</p>
			</div>

			<div className="flex items-center justify-between mt-2">
				<div>
					<Label>Reset All Shortcuts</Label>
					<p className="text-sm text-muted-foreground">
						Restore all shortcuts to their default values.
					</p>
				</div>
				<Button variant="outline" size="sm" className="gap-2">
					<ArrowsClockwiseIcon size={16} />
					Reset All
				</Button>
				<Button
					variant="outline"
					size="sm"
					className="gap-2"
					onClick={async () => {
						await refetch();
						console.log(shortcuts);
					}}
				>
					<KeyboardIcon size={16} />
					View All Shortcuts
				</Button>
			</div>

			<Tabs defaultValue="editor" className="mt-4">
				<TabsList>
					<TabsTrigger value="editor">Editor</TabsTrigger>
					<TabsTrigger value="navigation">Navigation</TabsTrigger>
				</TabsList>

				<TabsContent value="editor">
					<div className="space-y-4 mt-4">
						{Object.entries(editorShortcut).map(([extensionName, category]) => (
							<div key={category.title}>
								<h4 className="font-semibold">{category.title}</h4>
								<p className="text-sm text-muted-foreground">
									{category.description}
								</p>
								<Table className="flex flex-col gap-2 mt-2 space-y-2">
									<TableBody>
										{category.actions.map((shortcut) => (
											<TableRow
												key={shortcut.action}
												className="flex items-center justify-between"
											>
												<TableCell className="flex-2">
													<Label>{shortcut.title}</Label>
													<p className="mt-2 text-sm text-muted-foreground">
														{shortcut.description}
													</p>
													<p className="text-xs font-mono text-muted-foreground">
														Default: {shortcut.defaultHotkey}
													</p>
												</TableCell>
												<TableCell className="flex-1">
													<Button
														variant={
															listeningState?.action === shortcut.action
																? "secondary"
																: "outline"
														}
														size="sm"
														className="w-full cursor-pointer font-mono"
														onClick={() =>
															startListening(
																extensionName as ShortcutType,
																shortcut.action,
															)
														}
													>
														{listeningState?.action === shortcut.action ? (
															<span className="flex items-center gap-2 animate-pulse">
																<KeyboardIcon size={16} />
																{listeningState.keys.length > 0
																	? formatHotkey(listeningState.keys)
																	: "Press keys..."}
															</span>
														) : (
															// Hiển thị phím tắt hiện tại
															_.findKey(
																shortcuts.editor,
																(value) => value === shortcut.action,
															)
														)}
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						))}
					</div>
				</TabsContent>

				<TabsContent value="navigation">
					<div>456</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
