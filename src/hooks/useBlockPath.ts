import { useMemo } from "react";
import type { Element } from "slate";
import { ReactEditor, useSlateStatic } from "slate-react";

/**
 * Trả về path của block dưới dạng chuỗi được nối bằng đấu gạch ngang
 */
export function useBlockPath(element: Element): string {
  const editor = useSlateStatic();

  return useMemo(() => {
    try {
      const path = ReactEditor.findPath(editor, element);
      return path.join("-"); // Convert path array to string
    } catch {
      // Fallback nếu không tìm được path
      return `fallback-${Date.now()}-${Math.random()}`;
    }
  }, [editor, element]);
}
