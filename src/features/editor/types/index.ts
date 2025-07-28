import type { DeleteEditor } from "@/features/editor/delete";
import type { FormatEditor } from "@/features/editor/format";
import type { InsertEditor } from "@/features/editor/insert";
import type { SelectEditor } from "@/features/editor/select";
import type { BlockType, ElementBlock } from "@/features/editor/types/block";
import type { LeafText, MarkType } from "@/features/editor/types/leaf";
import type { UtilsEditor } from "@/features/editor/utils";
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
      FormatEditor;
    Element: ElementBlock;
    Text: LeafText;
  }
}

export type { BlockType, MarkType };
