import { useEffect, useRef, useState } from "react";
import {
  SLASH_MENU_ITEMS,
  type SlashMenuItem,
} from "@/components/Editor/SlashMenu/SlashMenuItems";
import {
  slashMenuManager,
  type SlashMenuState,
} from "@/features/editor/slash-command";
import { cn } from "@/lib/utils";

interface SlashCommandMenuProps {
  onSelectItem?: (item: SlashMenuItem) => void;
}

export default function SlashCommandMenu({
  onSelectItem,
}: SlashCommandMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [menuState, setMenuState] = useState<SlashMenuState>(() =>
    slashMenuManager.getState()
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Lọc items dựa trên search query
  const filteredItems = SLASH_MENU_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Đăng ký slash command
  useEffect(() => {
    const unsubscribe = slashMenuManager.subscribe((state) => {
      setMenuState(state);
      if (state.isOpen) {
        setSearchQuery("");
      }
    });

    return unsubscribe;
  }, []);

  // Xử lý các nút lên-xuống-enter để cho phép người dùng lựa chọn
  // các option trong slash menu
  useEffect(() => {
    if (!menuState.isOpen || !ref.current || !menuState.position) return;

    const el = ref.current;

    el.style.left = `${menuState.position.x}px`;
    el.style.top = `${menuState.position.y}px`;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredItems.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredItems.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (filteredItems[selectedIndex]) {
            onSelectItem?.(filteredItems[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuState.isOpen, selectedIndex, filteredItems, onSelectItem]);

  // Auto scroll to selected item
  useEffect(() => {
    if (!menuState.isOpen || !scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const selectedElement = scrollContainer.querySelector(
      `[data-index="${selectedIndex}"]`
    ) as HTMLElement;

    if (selectedElement) {
      // Tính toán vị trí relative của element trong container
      const elementTop = selectedElement.offsetTop;
      const elementBottom = elementTop + selectedElement.offsetHeight;
      const containerScrollTop = scrollContainer.scrollTop;
      const containerHeight = scrollContainer.clientHeight;

      // Kiểm tra xem element có nằm ngoài viewport không
      if (elementTop < containerScrollTop) {
        // Element ở phía trên viewport, scroll lên
        scrollContainer.scrollTop = elementTop;
      } else if (elementBottom > containerScrollTop + containerHeight) {
        // Element ở phía dưới viewport, scroll xuống
        scrollContainer.scrollTop = elementBottom - containerHeight;
      }
    }
  }, [selectedIndex, menuState.isOpen, filteredItems]);

  if (!menuState.isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn("z-50", menuState.position && `fixed left-0 top-0`)}
    >
      <div
        ref={scrollContainerRef}
        className={cn(
          "w-64 max-h-76 border shadow-md bg-white rounded-md",
          "overflow-y-auto scroll-py-1"
        )}
      >
        {filteredItems.length === 0 ? (
          <div>No blocks found.</div>
        ) : (
          <div>
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                data-index={index}
                onClick={() => onSelectItem?.(item)}
                className={cn("p-1")}
              >
                <div
                  className={cn(
                    "flex gap-3 cursor-pointer items-center p-2 rounded-sm",
                    index === selectedIndex && "bg-stone-100"
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
