import type { RenderElementProps } from "slate-react";

const CodeBlock = (props: RenderElementProps) => {
  return (
    <pre
      className="bg-stone-200/60 dark:bg-stone-700/30 p-4 my-1 overflow-auto text-sm rounded-sm"
      {...props.attributes}
      spellCheck={false}
    >
      <code spellCheck={false}>{props.children}</code>
    </pre>
  );
};

export default CodeBlock;
