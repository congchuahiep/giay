import type * as Y from "yjs";

export type Page = {
	id: string;
	title: string;
	icon: string;
	parent_page_id: string;
	page_data: Y.Doc;
	is_deleted: boolean;
};

export type PagePreview = {
	id: string;
	title: string;
	icon: string;
	parent_page_id: string;
	is_deleted: boolean;
	children: PagePreview[] | [];
};

export type PageRawData = {
	id: string;
	title: string;
	icon: string;
	parent_page_id: string;
	page_data: string;
	is_deleted: boolean;
	children: PagePreview[];
};
