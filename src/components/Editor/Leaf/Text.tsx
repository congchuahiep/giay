import clsx from "clsx";
import type { RenderLeafProps } from "slate-react";

const Text = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      className={clsx(
        props.leaf.bold && "font-bold",
        props.leaf.italic && "italic",
        props.leaf.underline && "underline",
        props.leaf.strikeThrough && "line-through",
        props.leaf.code &&
          "font-mono text-amber-900/75 bg-stone-100 p-1 rounded text-base/tight"
      )}
      spellCheck={!props.leaf.code}
    >
      {props.children}
    </span>
  );
};

export default Text;
