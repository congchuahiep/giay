import { useEffect, useRef, useState } from "react";
import { SLASH_MENU_ITEMS } from "@/components/Editor/SlashMenu/SlashMenuItems";
import {
  slashMenuManager,
  type SlashMenuState,
} from "@/features/editor/plugins/slash-command";
import { cn } from "@/lib/utils";
import { ReactEditor, useSlateSelection, useSlateStatic } from "slate-react";
import { useFuseSearch } from "@/features/search/useFuseSearch";
import { Editor } from "slate";

interface SlashCommandMenuProps {}

export default function SlashCommandMenu({}: SlashCommandMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const editor = useSlateStatic();
  const selection = useSlateSelection();
  const [menuState, setMenuState] = useState<SlashMenuState>(() =>
    slashMenuManager.getState()
  );

  // Lọc items dựa trên search query
  // Sử dụng Fuse.js để tìm kiếm
  const { filteredItems } = useFuseSearch(
    SLASH_MENU_ITEMS,
    menuState.searchQuery,
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
    }
  );

  // Đăng ký slash command, dùng để theo dõi trạng thái đóng/mở
  // slate command bằng `slashMenuManager`
  useEffect(() => {
    const unsubscribe = slashMenuManager.subscribe((state) => {
      setMenuState(state);
    });

    return unsubscribe;
  }, []);

  // Tự động reset selectedIndex khi filteredItems thay đổi
  useEffect(() => {
    if (menuState.selectedIndex >= filteredItems.length) {
      slashMenuManager.setSelectedIndex(0);
    }
  }, [filteredItems.length, menuState.selectedIndex]);

  // Xử lý các nút lên-xuống-enter để cho phép người dùng lựa chọn
  // các option trong slash menu
  useEffect(() => {
    if (!menuState.isOpen || !ref.current || !menuState.cursorCoordinates)
      return;

    const el = ref.current;

    el.style.left = `${menuState.cursorCoordinates.x}px`;
    el.style.top = `${menuState.cursorCoordinates.y}px`;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          const nextIndex =
            menuState.selectedIndex < filteredItems.length - 1
              ? menuState.selectedIndex + 1
              : 0;
          slashMenuManager.setSelectedIndex(nextIndex);

          scrollToIndex(nextIndex);
          break;
        case "ArrowUp":
          event.preventDefault();
          const prevIndex =
            menuState.selectedIndex > 0
              ? menuState.selectedIndex - 1
              : filteredItems.length - 1;
          slashMenuManager.setSelectedIndex(prevIndex);

          scrollToIndex(prevIndex);
          break;
        case "Enter":
          event.preventDefault();
          if (filteredItems[menuState.selectedIndex]) {
            editor.handleSlashCommandSelection(
              filteredItems[menuState.selectedIndex]
            );
          }
          // Note: SlashCommandPlugin sẽ xử lý preventDefault này
          break;
        case "Backspace":
          // Kiểm tra xem có xoá ký tự "/" không
          const { selection } = editor;
          if (selection) {
            const state = slashMenuManager.getState();
            const currentOffset = selection.anchor.offset;

            // Nếu đang ở ngay sau anchor và sắp xoá "/"
            if (currentOffset === state.anchorOffset + 1) {
              slashMenuManager.close();
            }
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuState.isOpen, menuState.selectedIndex, filteredItems]);

  // Helper function để scroll đến index
  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const selectedElement = scrollContainer.querySelector(
      `[data-index="${index}"]`
    ) as HTMLElement;

    if (selectedElement) {
      const elementTop = selectedElement.offsetTop;
      const elementBottom = elementTop + selectedElement.offsetHeight;
      const containerScrollTop = scrollContainer.scrollTop;
      const containerHeight = scrollContainer.clientHeight;

      if (elementTop < containerScrollTop) {
        scrollContainer.scrollTop = elementTop;
      } else if (elementBottom > containerScrollTop + containerHeight) {
        scrollContainer.scrollTop = elementBottom - containerHeight;
      }
    }
  };

  // Thực hiện việc tự động đóng slash menu:
  // - Anchor bị xoá
  // - Cursor di chuyển ra khỏi vùng anchor
  // Ngoài ra còn xử lý việc cập nhật search query theo thời gian thực
  useEffect(() => {
    if (!slashMenuManager.isMenuOpen()) return;

    const state = slashMenuManager.getState();

    // Kiểm tra nếu không có selection
    if (!selection) {
      slashMenuManager.close();
      return;
    }

    // Kiểm tra xem cursor có còn ở đúng vị trí anchor không
    const currentOffset = selection.anchor.offset;
    const anchorOffset = state.anchorOffset;

    // Nếu cursor di chuyển về trước anchor hoặc quá xa anchor
    if (currentOffset <= anchorOffset || currentOffset > anchorOffset + 15) {
      slashMenuManager.close();
      return;
    }

    try {
      const anchorPoint = { ...selection.anchor, offset: anchorOffset };
      const currentPoint = selection.anchor;

      const textFromAnchor = Editor.string(editor, {
        anchor: anchorPoint,
        focus: currentPoint,
      });

      // Nếu không bắt đầu bằng "/" thì đóng menu
      if (!textFromAnchor.startsWith("/")) {
        slashMenuManager.close();
        return;
      }

      // Cập nhật search query (bỏ ký tự "/" đầu tiên)
      const searchQuery = textFromAnchor.slice(1);
      if (searchQuery !== state.searchQuery) {
        slashMenuManager.updateSearchQuery(searchQuery);
      }
    } catch (error) {
      // Nếu có lỗi khi lấy text, đóng menu
      console.warn("Error in useSlashMenuAutoClose:", error);
      slashMenuManager.close();
    }
  }, [selection]);

  // Khi mới mở menu, tạm khoá khả năng người dùng sử dụng chuột tương
  // tác với menu trong một vài giây ngắn, việc này tăng thêm QOL lên
  // kha khá đó ^^
  useEffect(() => {
    setTimeout(() => {
      scrollContainerRef.current?.classList.remove("pointer-events-none");
    }, 50);
  });

  // Slash Command Menu không mở -> trả về null
  if (!menuState.isOpen) return null;

  const newLocal = () => {
    editor.handleSlashCommandSelection(filteredItems[menuState.selectedIndex]);
    // Focus vào Slate editor sau khi chọn
    ReactEditor.focus(editor);
  };
  // Slash Command Menu mở -> thực hiện render menu
  return (
    <div
      ref={ref}
      className={cn(
        "z-50",
        menuState.cursorCoordinates && `fixed left-0 top-0`
      )}
    >
      <div
        ref={scrollContainerRef}
        className={cn(
          "w-64 max-h-70 border shadow-md bg-white rounded-md",
          "overflow-y-auto scroll-py-1 pointer-events-none"
        )}
      >
        {filteredItems.length === 0 ? (
          <div className="items-center p-3 rounded-sm text-sm">
            No blocks found.
          </div>
        ) : (
          <div>
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                data-index={index}
                onClick={newLocal}
                onMouseEnter={() => slashMenuManager.setSelectedIndex(index)}
                className={cn("p-1")}
              >
                <div
                  className={cn(
                    "flex gap-3 cursor-pointer items-center p-2 rounded-sm",
                    index === menuState.selectedIndex && "bg-stone-100"
                  )}
                >
                  <span>{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500">
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
