import type { RenderElementProps } from "slate-react";
import {
	BulletListBlock,
	CheckList,
	CodeBlock,
	DividerBlock,
	Heading1Block,
	Heading2Block,
	Heading3Block,
	Heading4Block,
	PageBlock,
	ParagraphBlock,
	QuoteBlock,
} from "../components/block";
import { withBlockInteraction } from "../components/block-interaction";

// Map các block types với components
const blockComponents = {
	h1: withBlockInteraction(Heading1Block),
	h2: withBlockInteraction(Heading2Block),
	h3: withBlockInteraction(Heading3Block),
	h4: withBlockInteraction(Heading4Block),
	code: withBlockInteraction(CodeBlock),
	bulletList: withBlockInteraction(BulletListBlock),
	checkList: withBlockInteraction(CheckList),
	divider: withBlockInteraction(DividerBlock, { alignCenter: true }),
	quote: withBlockInteraction(QuoteBlock),
	paragraph: withBlockInteraction(ParagraphBlock), // default case
	page: withBlockInteraction(PageBlock, { alignCenter: true }),
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
