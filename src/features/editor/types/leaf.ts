export type MarkType = keyof Omit<LeafText, "text">;

export type LeafText = {
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	strikeThrough?: boolean;
	code?: boolean;
	codeBlock?: boolean;
	text: string;
};
