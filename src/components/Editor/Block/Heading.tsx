import { Node } from "slate";
import type { RenderElementProps } from "slate-react";
import { LeafPlaceholder } from "../Leaf";

export const Heading1Block = (props: RenderElementProps) => {
	const isEmpty = Node.string(props.element) === "";

	return (
		<h1
			className="mt-10 mb-2 text-4xl font-extrabold tracking-tight scroll-m-20"
			{...props.attributes}
		>
			<LeafPlaceholder isEmpty={isEmpty} placeholder="Heading 1" />
			{props.children}
		</h1>
	);
};

export const Heading2Block = (props: RenderElementProps) => {
	const isEmpty = Node.string(props.element) === "";

	return (
		<h2
			className="mt-6 text-3xl font-bold tracking-tight scroll-m-20"
			{...props.attributes}
		>
			<LeafPlaceholder isEmpty={isEmpty} placeholder="Heading 2" />
			{props.children}
		</h2>
	);
};

export const Heading3Block = (props: RenderElementProps) => {
	const isEmpty = Node.string(props.element) === "";

	return (
		<h3
			className="mt-3 text-xl font-bold tracking-tight scroll-m-20"
			{...props.attributes}
		>
			<LeafPlaceholder isEmpty={isEmpty} placeholder="Heading 3" />
			{props.children}
		</h3>
	);
};

export const Heading4Block = (props: RenderElementProps) => {
	const isEmpty = Node.string(props.element) === "";

	return (
		<h4
			className="mt-1 text-lg font-medium tracking-tight scroll-m-20"
			{...props.attributes}
		>
			<LeafPlaceholder isEmpty={isEmpty} placeholder="Heading 4" />
			{props.children}
		</h4>
	);
};
