import type { BaseEditor } from "slate";
import type { HistoryEditor } from "slate-history";
import type { ReactEditor } from "slate-react";
import type { DeleteEditor } from "@/features/editor/plugins/delete";
import type { FormatEditor } from "@/features/editor/plugins/format";
import type { InsertEditor } from "@/features/editor/plugins/insert";
import type { MarkdownEditor } from "@/features/editor/plugins/markdown";
import type { PageBlockEditor } from "@/features/editor/plugins/page-block";
import type { SelectEditor } from "@/features/editor/plugins/select";
import type { SlashEditor } from "@/features/editor/plugins/slash-menu";
import type { UtilsEditor } from "@/features/editor/plugins/utils";
import type { BlockType, ElementBlock } from "@/features/editor/types/block";
import type { LeafText, MarkType } from "@/features/editor/types/leaf";

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
			PageBlockEditor &
			SlashEditor;
		Element: ElementBlock;
		Text: LeafText;
	}
}

export type { BlockType, MarkType };
export * from "./block";
export * from "./leaf";
