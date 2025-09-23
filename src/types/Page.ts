import type * as Y from "yjs";

export type Page = {
	id: string;
	title: string;
	icon: string;
	parent_page_id: string;
	page_data: Y.Doc;
};

export type PagePreview = {
	id: string;
	title: string;
	icon: string;
	parent_page_id: string;
	children: PagePreview[] | [];
};

export type PageRawData = {
	id: string;
	title: string;
	icon: string;
	parent_page_id: string;
	page_data: string;
};

export type PageInWorkspace = {
	id: string;
	title: string;
	icon: string;
	parent_id: string;
	workspace_data: Y.Doc;
};
