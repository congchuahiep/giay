import { CodeIcon } from "@phosphor-icons/react/dist/csr/Code";
import { TextBIcon } from "@phosphor-icons/react/dist/csr/TextB";
import { TextHOneIcon } from "@phosphor-icons/react/dist/csr/TextHOne";
import { TextItalicIcon } from "@phosphor-icons/react/dist/csr/TextItalic";
import { TextStrikethroughIcon } from "@phosphor-icons/react/dist/csr/TextStrikethrough";
import { TextUnderlineIcon } from "@phosphor-icons/react/dist/csr/TextUnderline";
import { BugIcon } from "@phosphor-icons/react/dist/csr/Bug";
import ToggleBlockButton from "./ToggleBlockButton";
import ToggleMarkButton from "./ToggleMarkButton";
import { useSlateStatic } from "slate-react";
import { Button } from "@/components/ui/button";

const Toolbar = () => {
  return (
    <div className="flex gap-1">
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
