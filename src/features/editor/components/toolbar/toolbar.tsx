import { BugIcon } from "@phosphor-icons/react/dist/csr/Bug";
import { CodeIcon } from "@phosphor-icons/react/dist/csr/Code";
import { TextBIcon } from "@phosphor-icons/react/dist/csr/TextB";
import { TextHOneIcon } from "@phosphor-icons/react/dist/csr/TextHOne";
import { TextItalicIcon } from "@phosphor-icons/react/dist/csr/TextItalic";
import { TextStrikethroughIcon } from "@phosphor-icons/react/dist/csr/TextStrikethrough";
import { TextUnderlineIcon } from "@phosphor-icons/react/dist/csr/TextUnderline";
import { useSlateStatic } from "slate-react";
import { Button } from "@/components/ui/button";
import ToggleBlockButton from "./toggle-block-button";
import ToggleMarkButton from "./toggle-mark-button";

const Toolbar = () => {
	return (
		<div className="flex gap-1 z-10 fixed bottom-8 bg-popover p-1 rounded-md">
			<ToggleMarkButton format="bold" icon={<TextBIcon weight="bold" />} />
			<ToggleMarkButton
				format="italic"
				icon={<TextItalicIcon weight="bold" />}
			/>
			<ToggleMarkButton
				format="underline"
				icon={<TextUnderlineIcon weight="bold" />}
			/>
			<ToggleMarkButton
				format="strikeThrough"
				icon={<TextStrikethroughIcon weight="bold" />}
			/>
			<ToggleMarkButton format="code" icon={<CodeIcon weight="fill" />} />
			<ToggleBlockButton format="code" icon={<CodeIcon />} />
			<ToggleBlockButton format="h1" icon={<TextHOneIcon />} />
			<GetCurrentContentButton />
		</div>
	);
};

export default Toolbar;

const GetCurrentContentButton = () => {
	const editor = useSlateStatic();

	const handleMouseDown = () => {
		console.log(editor.children);
	};

	return (
		<Button
			variant={"destructive"}
			className="h-8"
			onMouseDown={handleMouseDown}
		>
			<BugIcon /> Content
		</Button>
	);
};
