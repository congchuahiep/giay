import { CodeIcon } from "@phosphor-icons/react/dist/csr/Code";
import { TextBIcon } from "@phosphor-icons/react/dist/csr/TextB";
import { TextHOneIcon } from "@phosphor-icons/react/dist/csr/TextHOne";
import { TextItalicIcon } from "@phosphor-icons/react/dist/csr/TextItalic";
import { TextStrikethroughIcon } from "@phosphor-icons/react/dist/csr/TextStrikethrough";
import { TextUnderlineIcon } from "@phosphor-icons/react/dist/csr/TextUnderline";
import ToggleBlockButton from "./ToggleBlockButton";
import ToggleMarkButton from "./ToggleMarkButton";

const Toolbar = () => {
  return (
    <div>
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
    </div>
  );
};

export default Toolbar;
