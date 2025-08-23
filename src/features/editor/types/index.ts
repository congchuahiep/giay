import type { DeleteEditor } from "@/features/editor/plugins/delete";
import type { FormatEditor } from "@/features/editor/plugins/format";
import type { InsertEditor } from "@/features/editor/plugins/insert";
import type { MarkdownEditor } from "@/features/editor/plugins/markdown";
import type { SelectEditor } from "@/features/editor/plugins/select";
import type { SlashEditor } from "@/features/editor/plugins/slash-command";
import type { BlockType, ElementBlock } from "@/features/editor/types/block";
import type { LeafText, MarkType } from "@/features/editor/types/leaf";
import type { UtilsEditor } from "@/features/editor/plugins/utils";
import type { BaseEditor } from "slate";
import type { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor &
      ReactEditor &
      HistoryEditor &
      UtilsEditor &
      InsertEditor &
      DeleteEditor &
      SelectEditor &
      FormatEditor &
      MarkdownEditor &
      SlashEditor;
    Element: ElementBlock;
    Text: LeafText;
  }
}

export type { BlockType, MarkType };
