import type { RenderElementProps } from "slate-react";

const CodeBlock = (props: RenderElementProps) => {
  return (
    <pre
      className="bg-stone-200/60 p-4 overflow-auto text-sm"
      {...props.attributes}
      spellCheck={false}
    >
      <code spellCheck={false}>{props.children}</code>
    </pre>
  );
};

export default CodeBlock;
