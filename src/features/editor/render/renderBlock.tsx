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
import { withBlockInteraction } from "@/components/Editor/DragHandle";


// Map các block types với components
const blockComponents = {
  h1: withBlockInteraction(Heading1Block),
  h2: withBlockInteraction(Heading2Block),
  h3: withBlockInteraction(Heading3Block),
  h4: withBlockInteraction(Heading4Block),
  code: withBlockInteraction(CodeBlock),
  bulletList: withBlockInteraction(BulletListBlock),
  checkList: withBlockInteraction(CheckList),
  divider: withBlockInteraction(DividerBlock),
  quote: withBlockInteraction(QuoteBlock),
  paragraph: withBlockInteraction(ParagraphBlock), // default case
} as const;

/**
 * Sử dụng để render các block khác nhau
 * @param props
 * @returns
 */
export default function renderBlock(props: RenderElementProps) {
  const blockType = props.element.type as keyof typeof blockComponents;
  const BlockComponent =
    blockComponents[blockType] || blockComponents.paragraph;

  return <BlockComponent {...props} />;
}
