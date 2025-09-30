import { SLASH_MENU_ITEMS } from "@/components/Editor/SlashMenu/SlashMenuItems";
import { useRegisterShortcuts, useShortcutStore } from "@/core/shortcut";
import {
	OpenSlashCommandShortcutExtension,
	SlashCommandShortcutExtension,
	useSlashMenuStore,
} from "@/features/editor/plugins/slash-menu";
import { useFuseSearch } from "@/features/search/useFuseSearch";
import { cn, scrollToDataAttribute } from "@/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Editor } from "slate";
import { ReactEditor, useSlateSelection, useSlateStatic } from "slate-react";

export default function SlashMenu() {
	const slashRef = useRef<HTMLDivElement | null>(null);
	const slashContainerRef = useRef<HTMLDivElement | null>(null);
	const editor = useSlateStatic();
	const selection = useSlateSelection();

	const [allowMouseHover, setAllowMouseHover] = useState(false);

	const {
		setSelectedIndex,
		updateSearchQuery,
		open: openSlashCommand,
		close: closeSlashCommand,
	} = useSlashMenuStore();

	const slashMenuState = useSlashMenuStore.getState();

	const { setActiveShortcutScope } = useShortcutStore();

	// Lọc items dựa trên search query
	// Sử dụng Fuse.js để tìm kiếm
	const { filteredItems } = useFuseSearch(
		SLASH_MENU_ITEMS,
		slashMenuState.searchQuery,
		{
			threshold: 0.3, // Độ chính xác (0.0 = perfect match, 1.0 = match anything)
			minMatchCharLength: 1, // Độ dài tối thiểu của chuỗi tìm kiếm
			shouldSort: true, // TODO Tìm hiểu kỹ hơn thuật toán sort
			keys: [
				// Các trường để tìm kiếm
				{
					name: "title",
					weight: 0.5, // Trọng số cao hơn cho title
				},
				{
					name: "description",
					weight: 0.1,
				},
				{
					name: "blockType",
					weight: 0.4,
				},
			],
		},
	);

	/// HELPER FUNCTION

	// Tự scroll đến vị trí của slash item bằng index
	const scrollToIndex = useCallback((index: number) => {
		scrollToDataAttribute("slash-item-index", index, slashContainerRef);
	}, []);

	/**
	 * Reset vị trí scroll về đầu mỗi khi menu đóng
	 */
	const resetPosition = useCallback(() => {
		if (!slashContainerRef.current) return;
		slashContainerRef.current.scrollTop = 0;
	}, []);

	/// ĐĂNG KÝ SHORTCUTS

	// biome-ignore lint/correctness/useExhaustiveDependencies: Không cần phụ thuộc vào các biến khác
	const slashMenuShortcutContext = useMemo(
		() => ({
			editor,
			slashMenuState,
			filteredItems,
			closeSlashCommand,
			scrollToIndex,
			setSelectedIndex,
		}),
		[slashMenuState],
	);

	const openSlashMenuShortcutContext = useMemo(
		() => ({
			editor,
			openSlashCommand,
			slashRef,
			slashContainerRef,
		}),
		[editor, openSlashCommand],
	);

	// Đăng ký shortcut để mở editor
	useRegisterShortcuts(
		"editor", // Mở trên phạm vi editor
		openSlashMenuShortcutContext,
		[OpenSlashCommandShortcutExtension],
	);

	// Đăng ký bộ shortcut khi đang mở editor
	useRegisterShortcuts("slash-menu", slashMenuShortcutContext, [
		SlashCommandShortcutExtension,
	]);

	/// CÁC USEEFFECT
	//

	/**
	 * Khi menu mở, kích hoạt scope phím tắt của slash-command
	 */
	useEffect(() => {
		// Chỉ scroll slashContainerRef, còn lại chặn mọi thứ
		const preventOutsideScroll = (e: WheelEvent) => {
			if (slashContainerRef.current?.contains(e.target as Node)) {
				e.stopPropagation();
			} else {
				e.preventDefault();
			}
		};

		if (slashMenuState.isOpen) {
			setActiveShortcutScope("slash-menu"); // Chuyển sang scope slash-command
			// Chặn không được cuộn trang khi mở menu không CSS
			document.addEventListener("wheel", preventOutsideScroll, {
				passive: false,
			});
		} else {
			setActiveShortcutScope("editor"); // Trả về scope editor khi slash menu đóng
			document.removeEventListener("wheel", preventOutsideScroll);
			resetPosition();
		}

		return () => {
			document.removeEventListener("wheel", preventOutsideScroll);
			resetPosition();
		};
	}, [slashMenuState.isOpen, setActiveShortcutScope, resetPosition]);

	/**
	 * Khi viewport bị thay đổi (người dùng tuỳ chỉnh kích thước màn hình)
	 * -> đóng menu
	 */
	useEffect(() => {
		const handleResize = () => {
			closeSlashCommand();
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [closeSlashCommand]);

	/**
	 * Tự động reset selectedIndex về vị trí đầu tiên khi filteredItems thay đổi
	 */
	useEffect(() => {
		if (slashMenuState.selectedIndex >= filteredItems.length) {
			setSelectedIndex(0);
		}
	}, [filteredItems.length, slashMenuState.selectedIndex, setSelectedIndex]);

	/**
	 * Kiểm tra vị trí selection hiện tại của người dùng, nhờ đó nó thực hiện được
	 * hai việc:
	 * - Tự động đóng slash menu: khi anchor bị xoá, khi cursor di chuyển ra khỏi
	 * vùng anchor
	 * - Cập nhật danh sách search query theo thời gian thực
	 */
	// biome-ignore lint/correctness/useExhaustiveDependencies: Không cần phụ thuộc vào biến slashMenuState.isOpen
	useEffect(() => {
		if (!slashMenuState.isOpen) return;

		// Kiểm tra nếu không có selection
		if (!selection) {
			closeSlashCommand();
			return;
		}

		// Kiểm tra xem cursor có còn ở đúng vị trí anchor không
		const currentOffset = selection.anchor.offset;

		// Nếu cursor di chuyển về trước anchor hoặc quá xa anchor
		if (
			currentOffset <= slashMenuState.anchorOffset ||
			currentOffset > slashMenuState.anchorOffset + 15
		) {
			closeSlashCommand();
			return;
		}

		try {
			const anchorPoint = {
				...selection.anchor,
				offset: slashMenuState.anchorOffset,
			};
			const currentPoint = selection.anchor;

			const textFromAnchor = Editor.string(editor, {
				anchor: anchorPoint,
				focus: currentPoint,
			});

			// Nếu không bắt đầu bằng "/" thì đóng menu
			if (!textFromAnchor.startsWith("/")) {
				closeSlashCommand();
				return;
			}

			// Cập nhật search query (bỏ ký tự "/" đầu tiên)
			const searchQuery = textFromAnchor.slice(1);
			if (searchQuery !== slashMenuState.searchQuery) {
				updateSearchQuery(searchQuery);
			}
		} catch (error) {
			// Nếu có lỗi khi lấy text, đóng menu
			console.warn("Error in useSlashMenuAutoClose:", error);
			closeSlashCommand();
		}
	}, [selection]);

	/**
	 * Khi mới mở menu, tạm khoá khả năng người dùng sử dụng chuột tương
	 * tác với menu trong một vài giây ngắn, việc này tăng thêm QOL lên
	 * kha khá đó ^^
	 */
	// biome-ignore lint/correctness/useExhaustiveDependencies: Cần phụ thuộc vào selectedIndex để xử lý sự kiện click chuột
	useEffect(() => {
		setAllowMouseHover(false);
		// Reset selectedIndex nếu muốn
		// setSlashMenuState((prev) => ({ ...prev, selectedIndex: -1 }));

		const enableHover = () => {
			setAllowMouseHover(true);
		};

		// Khi có mousemove thì mới cho phép hover
		const container = slashContainerRef.current;
		if (container) {
			window.addEventListener("mousemove", enableHover, { once: true });
		}

		return () => {
			if (container) {
				window.removeEventListener("mousemove", enableHover);
			}
		};
	}, [slashMenuState.isOpen, filteredItems]);

	/// CÁC EVENT HANDLER
	/**
	 * Xử lý khi người dùng click vào một item trong slash command menu
	 * (thường là click chuột trái vào item đó)
	 * Chức năng chính là gọi hàm handleSlashCommandSelection của editor
	 */
	const onSlashItemClick = () => {
		editor.handleSelectSlashItem(
			filteredItems[slashMenuState.selectedIndex],
			slashMenuState,
			closeSlashCommand,
		);
		// Focus vào Slate editor sau khi chọn
		ReactEditor.focus(editor);
	};

	// Slash Command Menu mở -> thực hiện render menu
	return (
		<div
			ref={slashRef}
			className={cn(
				"h-70 z-50 overflow fixed left-0 top-0 flex",
				slashMenuState.displayPosition?.placement === "top"
					? "items-end"
					: "items-start",
				slashMenuState.isOpen
					? "opacity-100 pointer-events-auto"
					: "opacity-0 pointer-events-none",
			)}
		>
			<div
				ref={slashContainerRef}
				className={cn(
					"w-64 h-auto max-h-70 border overflow-y-auto",
					"shadow-md bg-popover rounded-md",
					!allowMouseHover && "pointer-events-none",
				)}
			>
				{filteredItems.length === 0 ? (
					<div className="items-center p-3 text-sm rounded-sm">
						No blocks found.
					</div>
				) : (
					<div>
						{filteredItems.map((item, index) => (
							// biome-ignore lint/a11y/noStaticElementInteractions: why not?
							// biome-ignore lint/a11y/useKeyWithClickEvents: why not #2?
							<div
								key={item.id}
								data-slash-item-index={index}
								onClick={onSlashItemClick}
								onMouseEnter={() => setSelectedIndex(index)}
								className={cn("p-1")}
							>
								<div
									className={cn(
										"flex gap-3 cursor-pointer items-center p-2 rounded-sm",
										index === slashMenuState.selectedIndex &&
											"bg-stone-100 dark:bg-stone-700",
									)}
								>
									<span>{item.icon}</span>
									<div className="flex-1">
										<div className="text-sm font-medium">{item.title}</div>
										<div className="text-xs text-stone-500">
											{item.description}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
