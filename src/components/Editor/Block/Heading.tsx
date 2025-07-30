import { Node } from "slate";
import type { RenderElementProps } from "slate-react";
import { LeafPlaceholder } from "../Leaf";

export const Heading1Block = (props: RenderElementProps) => {
	const isEmpty = Node.string(props.element) === "";

	return (
		<h1
			className="mt-10  p-1 scroll-m-20 text-4xl font-extrabold tracking-tight text-balance"
			{...props.attributes}
		>
			<LeafPlaceholder isEmpty={isEmpty} placeholder="Heading 1" />
			{props.children}
		</h1>
	);
};

export const Heading2Block = (props: RenderElementProps) => {
	return (
		<h2
			className="mt-6 p-1 scroll-m-20 text-3xl font-bold tracking-tight text-balance"
			{...props.attributes}
		>
			{props.children}
		</h2>
	);
};

export const Heading3Block = (props: RenderElementProps) => {
	return (
		<h3
			className="mt-3 p-1 scroll-m-20 text-xl font-bold tracking-tight text-balance"
			{...props.attributes}
		>
			{props.children}
		</h3>
	);
};

export const Heading4Block = (props: RenderElementProps) => {
	return (
		<h4
			className="mt-1 p-1 scroll-m-20 text-lg font-medium tracking-tight text-balance"
			{...props.attributes}
		>
			{props.children}
		</h4>
	);
};
