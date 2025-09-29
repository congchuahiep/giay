import { withYjs, YjsEditor } from "@slate-yjs/core";
import { useEffect, useMemo, useState } from "react";
import { createEditor, Editor, Transforms } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import * as Y from "yjs";
import { useYjsPage } from "@/features/yjs-page";
import { useYjsWorkspace } from "@/features/yjs-workspace";
import { cn } from "@/utils";
import { Button } from "../ui/button";
import {
	EmojiPicker,
	EmojiPickerContent,
	EmojiPickerFooter,
} from "../ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function TitleEditor() {
	const [isEmojiMenuOpen, setIsEmojiMenuOpen] = useState(false);
	const [pageIcon, setPageIcon] = useState<string | null>(null);

	const currentPage = useYjsPage((state) => state.currentPage);
	const pageProvider = useYjsPage((state) => state.provider);
	const workspaceProvider = useYjsWorkspace((state) => state.provider);

	const pageTitleData = useMemo(() => {
		return pageProvider.document.get("title", Y.XmlText);
	}, [pageProvider]);

	const pageIconData = useMemo(() => {
		return pageProvider.document.get("icon", Y.Text);
	}, [pageProvider]);

	const editor = useMemo(() => {
		return withYjs(withReact(withTitleSchema(createEditor())), pageTitleData);
	}, [pageTitleData]);

	//
	// CÁC EFFECT
	//

	// Kết nối với Yjs
	useEffect(() => {
		YjsEditor.connect(editor);
		return () => YjsEditor.disconnect(editor); // Đóng kết nối khi kết thúc làm việc
	}, [editor]);

	// Lấy icon từ Yjs
	useEffect(() => {
		// Cập nhật lần đầu
		setPageIcon(pageIconData.toString());
		const observer = () => {
			setPageIcon(pageIconData.toString());
		};

		// Đăng ký lắng nghe thay đổi
		pageIconData.observe(observer);

		return () => {
			pageIconData.unobserve(observer);
		};
	}, [pageIconData]);

	//
	// CÁC EVENT
	//

	// Hàm tuỳ chỉnh logic khi setPageIcon
	const updatePageIcon = (icon: string) => {
		// Xóa toàn bộ nội dung hiện tại
		pageIconData.delete(0, pageIconData.length);
		pageIconData.insert(0, icon);

		const sidebarPages = workspaceProvider.document.getMap(
			currentPage.parent_page_id ? currentPage.parent_page_id : "root-pages",
		);

		sidebarPages.set(currentPage.id, {
			id: currentPage.id,
			icon: icon,
			title: pageTitleData.toString(),
		});

		setPageIcon(icon);
	};

	// Hàm tuỳ chỉnh logic khi setPageTitle, giúp cho sidebar tự cập nhật
	const updatePageTitle = (title: string) => {
		const sidebarPages = workspaceProvider.document.getMap(
			currentPage.parent_page_id ? currentPage.parent_page_id : "root-pages",
		);

		sidebarPages.set(currentPage.id, {
			id: currentPage.id,
			icon: pageIconData.toString(),
			title: title,
		});
	};

	return (
		<div className="flex flex-col w-full pt-12 py-2 group mb-4">
			<div className="flex items-center">
				<Popover onOpenChange={setIsEmojiMenuOpen} open={isEmojiMenuOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							className={cn(
								"rounded-lg cursor-pointer duration-0 text-xs text-neutral-600 -mx-3 hover:text-neutral-800 dark:hover:text-neutral-400",
								"hover:bg-transparent dark:hover:bg-transparent",
								pageIcon
									? "hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50  -mx-2 h-24 w-24 text-6xl"
									: "opacity-0 group-hover:opacity-100",
							)}
						>
							{pageIcon ? <span>{pageIcon}</span> : "Open emoji picker"}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-fit p-0">
						<EmojiPicker
							className="h-[342px]"
							onEmojiSelect={({ emoji }) => {
								setIsEmojiMenuOpen(false);
								updatePageIcon(emoji);
							}}
						>
							{/*<EmojiPickerSearch /> NOTE: CHƯA XỬ LÝ! CONFLICT VỚI EDITOR */}
							<EmojiPickerContent />
							<EmojiPickerFooter />
						</EmojiPicker>
					</PopoverContent>
				</Popover>
			</div>
			<Slate
				editor={editor}
				initialValue={[]}
				onChange={(value) => {
					const text = value[0].children[0].text;
					updatePageTitle(text);
				}}
			>
				<Editable
					className="text-5xl font-bold focus:outline-none leading-14"
					placeholder="New page"
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.preventDefault();
						}
					}}
					onClick={() => console.log(pageTitleData)}
					spellCheck={false}
				/>
			</Slate>
			<div className="flex items-center space-x-2"></div>
		</div>
	);
}

const withTitleSchema = (editor: Editor) => {
	const { normalizeNode } = editor;

	editor.normalizeNode = (entry, options) => {
		const [node] = entry;

		// Đảm bảo chỉ có 1 node duy nhất
		// if (path.length === 0) {
		// 	if (editor.children.length > 1) {
		// 		for (let i = 1; i < editor.children.length; i++) {
		// 			editor.children.splice(i, 1);
		// 		}
		// 		return;
		// 	}
		// }

		// Nếu editor rỗng, thêm initial value với ID
		if (Editor.isEditor(node) && node.children.length === 0) {
			console.log("Editor is empty", editor);

			Transforms.insertNodes(
				editor,
				[{ id: "0", type: "paragraph", children: [{ text: "" }] }],
				{ at: [0] },
			);
			return;
		}

		return normalizeNode(entry, options);
	};

	return editor;
};
