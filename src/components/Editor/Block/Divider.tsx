import { useSelected, type RenderElementProps } from "slate-react";
import { useSlateStatic, ReactEditor } from "slate-react";
import { Transforms } from "slate";
import { cn } from "@/lib/utils";

const DividerBlock = (props: RenderElementProps) => {
  const editor = useSlateStatic();
  const isSelected = useSelected();

  const handleClick = () => {
    const path = ReactEditor.findPath(editor, props.element);
    Transforms.select(editor, path);
  };

  /**
   * Xử lý vấn đề xoá node, chỉ divider đặc biệt có logic gắn liền nó thế này
   * không khuyến khích tạo các logic xử lý này ngay bên trong element
   * @param event
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      Transforms.setNodes(editor, { type: "paragraph" });
    }
  };

  return (
    <div
      {...props.attributes}
      className={cn(
        "flex items-center cursor-pointer p-2 outline-none select-none",
        isSelected && "bg-blue-500/15 rounded-sm"
      )}
      contentEditable={false}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Hidden children để Slate vẫn có thể track */}
      <span className="hidden select-none">{props.children}</span>
      {/* Divider line */}
      <hr className="border-stone-300 border-1 transition-colors duration-150 flex-1" />
    </div>
  );
};

export default DividerBlock;
