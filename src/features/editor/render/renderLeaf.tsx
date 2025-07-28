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
          "font-mono text-violet-700/75 bg-stone-100 p-1 rounded text-[0.9rem] text-base/tight"
      )}
      spellCheck={!props.leaf.code}
    >
      {props.children}
    </span>
  );
}
