import { type JSX } from "react";
import { Button } from "@/components/ui/button";
import { useSlateSelector, useSlateStatic } from "slate-react";
import type { MarkType } from "@/features/editor/types";
import { cn } from "@/lib/utils";

const ToggleMarkButton = ({
  icon,
  format,
}: {
  icon: JSX.Element;
  format: MarkType;
}) => {
  const editor = useSlateStatic();
  const isActive = useSlateSelector((editor) => editor.isMarkActive(format));

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    editor.toggleMark(format);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "size-8 cursor-pointer",
        isActive && "text-blue-600 hover:text-blue-600"
      )}
      onMouseDown={handleMouseDown}
    >
      {icon}
    </Button>
  );
};

export default ToggleMarkButton;
