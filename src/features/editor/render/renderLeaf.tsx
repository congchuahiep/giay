import clsx from "clsx";
import type { RenderLeafProps } from "slate-react";

/**
 * Inline renderer for Slate leaf nodes.
 */
export default function renderLeaf(props: RenderLeafProps) {
  return (
    <span
      {...props.attributes}
      className={clsx(
        props.leaf.bold && "font-bold",
        props.leaf.italic && "italic",
        props.leaf.underline && "underline",
        props.leaf.strikeThrough && "line-through",
        props.leaf.code &&
          "font-mono text-accent-foreground/80 bg-stone-200/60 p-1 rounded text-[80%] z-1"
      )}
      spellCheck={!props.leaf.code}
    >
      {props.children}
    </span>
  );
}
