import { Checkbox } from "@/components/ui/checkbox";
import type { CheckListType } from "@/features/editor/types/block";
import { cn } from "@/lib/utils";
import { Transforms } from "slate";
import {
  ReactEditor,
  useSlateStatic,
  type RenderElementProps,
} from "slate-react";

export function CheckList(props: RenderElementProps) {
  const editor = useSlateStatic();
  const { checked } = props.element as CheckListType;

  const handleToggleCheck = () => {
    const path = ReactEditor.findPath(editor, props.element);

    Transforms.setNodes(editor, { checked: !checked }, { at: path });
  };

  return (
    <div
      {...props.attributes}
      className={"flex items-start gap-3 py-1 pl-1 group"}
    >
      {/* Checkbox using Shadcn */}
      <div contentEditable={false} className="flex items-center pt-0.5">
        <Checkbox
          checked={checked ?? false}
          onCheckedChange={handleToggleCheck}
          className={cn(
            "w-5 h-5 transition-all duration-200 border-stone-500",
            "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
          )}
          aria-label={checked ? "Uncheck item" : "Check item"}
        />
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex-1 min-w-0 transition-all duration-200",
          checked && [
            "text-gray-500 opacity-70",
            "[&_*]:line-through [&_*]:decoration-gray-400",
          ]
        )}
      >
        {props.children}
      </div>
    </div>
  );
}

export default CheckList;
