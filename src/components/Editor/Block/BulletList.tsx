import type { RenderElementProps } from "slate-react";

const BulletListBlock = (props: RenderElementProps) => {
  return (
    <div className="py-1 flex items-center" {...props.attributes}>
      <div
        className="mx-[13px] font-black w-1.5 rounded-xl h-1.5 select-none bg-stone-700"
        contentEditable={false}
      >
        {" "}
      </div>
      <span className="flex-1 min-w-0">{props.children}</span>
    </div>
  );
};

export default BulletListBlock;
