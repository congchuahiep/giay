import ToggleMarkButton from "@/components/Editor/Toolbar/ToggleMarkButton";
import { Portal } from "@/components/Portal";
import { cn } from "@/lib/utils";
import { CodeIcon } from "@phosphor-icons/react/dist/icons/Code";
import { TextBIcon } from "@phosphor-icons/react/dist/icons/TextB";
import { TextItalicIcon } from "@phosphor-icons/react/dist/icons/TextItalic";
import { TextStrikethroughIcon } from "@phosphor-icons/react/dist/icons/TextStrikethrough";
import { TextUnderlineIcon } from "@phosphor-icons/react/dist/icons/TextUnderline";
import { useEffect, useRef } from "react";
import { Editor, Range } from "slate";
import { useFocused, useSlate } from "slate-react";

const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    if (domSelection && domSelection.rangeCount > 0) {
      const domRange = domSelection.getRangeAt(0);
      const rect = domRange.getBoundingClientRect();
      el.style.opacity = "1";
      el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
      el.style.left = `${
        rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
      }px`;
    }
  });

  return (
    <Portal>
      <div
        ref={ref}
        className={cn(
          "p-0.5 absolute z-10 opacity-0 hover-toolbar -mt-1",
          "bg-stone-50 shadow-md rounded-md border-1"
        )}
        onMouseDown={(e) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault();
        }}
      >
        <ToggleMarkButton format="bold" icon={<TextBIcon weight="bold" />} />
        <ToggleMarkButton
          format="italic"
          icon={<TextItalicIcon weight="bold" />}
        />
        <ToggleMarkButton
          format="underline"
          icon={<TextUnderlineIcon weight="bold" />}
        />
        <ToggleMarkButton
          format="strikeThrough"
          icon={<TextStrikethroughIcon weight="bold" />}
        />
        <ToggleMarkButton format="code" icon={<CodeIcon weight="fill" />} />
      </div>
    </Portal>
  );
};

export default HoveringToolbar;
