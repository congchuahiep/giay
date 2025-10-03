import { CheckSquareIcon } from "@phosphor-icons/react/dist/csr/CheckSquare";
// import { ListNumbersIcon } from "@phosphor-icons/react/dist/icons/ListNumbers";
import { CodeIcon } from "@phosphor-icons/react/dist/csr/Code";
import { FileIcon } from "@phosphor-icons/react/dist/csr/File";
import { ListBulletsIcon } from "@phosphor-icons/react/dist/csr/ListBullets";
import { MinusIcon } from "@phosphor-icons/react/dist/csr/Minus";
import { QuotesIcon } from "@phosphor-icons/react/dist/csr/Quotes";
import { TextHFourIcon } from "@phosphor-icons/react/dist/csr/TextHFour";
import { TextHOneIcon } from "@phosphor-icons/react/dist/csr/TextHOne";
import { TextHThreeIcon } from "@phosphor-icons/react/dist/csr/TextHThree";
import { TextHTwoIcon } from "@phosphor-icons/react/dist/csr/TextHTwo";
import { TextTIcon } from "@phosphor-icons/react/dist/csr/TextT";
import type { JSX } from "react";
import type { BlockType } from "@/features/editor/types";

export interface SlashMenuItem {
	id: string;
	title: string;
	description: string;
	icon: JSX.Element;
	blockType: BlockType;
}

/**
 * Danh sách các block types có sẵn
 */
export const SLASH_MENU_ITEMS: SlashMenuItem[] = [
	{
		id: "paragraph",
		title: "Text",
		description: "Just start writing with plain text.",
		icon: <TextTIcon />,
		blockType: "paragraph",
	},
	{
		id: "heading-1",
		title: "Heading 1",
		description: "Big section heading.",
		icon: <TextHOneIcon />,
		blockType: "h1",
	},
	{
		id: "heading-2",
		title: "Heading 2",
		description: "Medium section heading.",
		icon: <TextHTwoIcon />,
		blockType: "h2",
	},
	{
		id: "heading-3",
		title: "Heading 3",
		description: "Small section heading.",
		icon: <TextHThreeIcon />,
		blockType: "h3",
	},
	{
		id: "heading-4",
		title: "Heading 4",
		description: "Tiny section heading.",
		icon: <TextHFourIcon />,
		blockType: "h4",
	},
	{
		id: "bulleted-list",
		title: "Bulleted List",
		description: "Create a simple bulleted list.",
		icon: <ListBulletsIcon />,
		blockType: "bulletList",
	},
	{
		id: "checked-list",
		title: "Checked List",
		description: "Create a simple checked list.",
		icon: <CheckSquareIcon />,
		blockType: "checkList",
	},
	// {
	//   id: "numbered-list",
	//   title: "Numbered List",
	//   description: "Create a list with numbering.",
	//   icon: <ListNumbersIcon />,
	//   blockType: "numberedList",
	// },
	{
		id: "code-block",
		title: "Code",
		description: "Capture a code snippet.",
		icon: <CodeIcon />,
		blockType: "code",
	},
	{
		id: "quote-block",
		title: "Quote",
		description: "A blockquote for highlighting important text.",
		icon: <QuotesIcon />,
		blockType: "quote",
	},
	{
		id: "divider",
		title: "Divider",
		description: "Visually divide blocks.",
		icon: <MinusIcon />,
		blockType: "divider",
	},
	{
		id: "page",
		title: "Page",
		description: "Insert and create a page.",
		icon: <FileIcon />,
		blockType: "page",
	},
];
