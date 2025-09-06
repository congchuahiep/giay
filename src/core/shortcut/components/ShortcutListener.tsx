import { useEffect } from "react";
import { useShortcutStore } from "../store/shortcutStore";

/**
   * Component này lắng nghe tất cả các phím tắt trong ứng dụng.
   * Nên được đặt ở cấp cao nhất của ứng dụng.
   * 
   * @example
   * ```tsx
   * function App() {
   *   return (
   *     <div>
   *       <ShortcutListener />
   *       <Editor />
   *       { ...Other components }
   *     </div>
   *   );
   * }
   * ```
   */
export function ShortcutListener() {
  const { handleKeyDown } = useShortcutStore();

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      handleKeyDown(event as any);
    };
    
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [handleKeyDown]);

  return null; // Component này không hiển thị gì cả
}