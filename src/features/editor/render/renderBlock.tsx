import type { RenderElementProps } from "slate-react";
import {
  BulletListBlock,
  CheckList,
  CodeBlock,
  Heading1Block,
  Heading2Block,
  Heading3Block,
  Heading4Block,
  ParagraphBlock,
  QuoteBlock,
  DividerBlock,
} from "@/components/Editor/Block";
// import NumberedListBlock from "@/components/Editor/Block/NumberedList";

/**
 * Sử dụng để render các block khác nhau
 * @param props
 * @returns
 */
export default function renderBlock(props: RenderElementProps) {
  switch (props.element.type) {
    case "h1":
      return <Heading1Block {...props} />;
    case "h2":
      return <Heading2Block {...props} />;
    case "h3":
      return <Heading3Block {...props} />;
    case "h4":
      return <Heading4Block {...props} />;
    case "code":
      return <CodeBlock {...props} />;
    case "bulletList":
      return <BulletListBlock {...props} />;
    // case "numberedList":
    //   return <NumberedListBlock {...props} />;
    case "checkList":
      return <CheckList {...props} />;
    case "divider":
      return <DividerBlock {...props} />;
    case "quote":
      return <QuoteBlock {...props} />;
    default:
      return <ParagraphBlock {...props} />;
  }
}
