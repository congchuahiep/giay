import type { RenderElementProps } from "slate-react";
import { LeafPlaceholder } from "../leaf";
import { Node } from "slate";

const QuoteBlock = (props: RenderElementProps) => {
	const isEmpty = Node.string(props.element) === "";

	return (
		<blockquote
			className="m-1 py-1 pl-3 border-l-3 border-black dark:border-stone-50"
			{...props.attributes}
			spellCheck={false}
		>
			<LeafPlaceholder isEmpty={isEmpty} placeholder="Empty quote" />
			{props.children}
		</blockquote>
	);
};

export default QuoteBlock;
