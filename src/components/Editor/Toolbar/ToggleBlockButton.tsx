import { type JSX } from "react";
import { Button } from "@/components/ui/button";
import { useSlateSelector, useSlateStatic } from "slate-react";
import type { BlockType } from "@/features/editor/types";

const ToggleBlockButton = ({
  icon,
  format,
}: {
  icon: JSX.Element;
  format: BlockType;
}) => {
  const editor = useSlateStatic();
  const isActive = useSlateSelector((editor) => editor.isBlockType(format));

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    editor.toggleBlock(format);
  };

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="icon"
      className="size-8"
      onMouseDown={handleMouseDown}
    >
      {icon}
    </Button>
  );
};

export default ToggleBlockButton;
