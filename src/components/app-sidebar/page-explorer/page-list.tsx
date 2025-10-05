import { useEffect, useState } from "react";
import {
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { useYjsWorkspace } from "@/features/yjs-workspace";
import type { PagePreview } from "@/types";
import { cn } from "@/utils";
import PageItem from "./page-item";

/**
 * Hiển thị danh sách các trang gốc trong workspace.
 * Nếu đang kết nối dữ liệu sẽ hiển thị skeleton loading, nếu không có trang sẽ
 * hiển thị thông báo. Các trang được sắp xếp theo tên và có thể mở rộng để xem
 * các trang con.
 */
export default function PageList() {
	const provider = useYjsWorkspace((state) => state.provider);
	const status = useYjsWorkspace((state) => state.status);
	const [pages, setPages] = useState<Record<string, PagePreview>>({});

	useEffect(() => {
		const rootPages = provider.document.getMap("root-pages");
		setPages(rootPages.toJSON());

		// Lắng nghe thay đổi trong array
		const handlePagesChange = () => {
			setPages(rootPages.toJSON());
		};

		rootPages.observe(handlePagesChange);

		return () => {
			rootPages.unobserve(handlePagesChange);
		};
	}, [provider]);

	return status === "connecting" ? (
		Array.from({ length: 8 }, (_, index) => (
			// biome-ignore lint/suspicious/noArrayIndexKey: Static element
			<SidebarMenuItem key={index}>
				<SidebarMenuSkeleton />
			</SidebarMenuItem>
		))
	) : pages && Object.keys(pages).length !== 0 ? (
		<SidebarMenu>
			{Object.entries(pages)
				.filter(([_, page]) => !page.is_deleted)
				.sort((a, b) => a[1].title.localeCompare(b[1].title))
				.map(([id, item]) => (
					<PageItem key={id} pageId={id} pageData={item} />
				))}
		</SidebarMenu>
	) : (
		<SidebarGroupLabel>
			<div className={cn("text-center w-full pt-4")}>
				Oops! Looks like you don't have <br /> any pages. Create a new one?
			</div>
		</SidebarGroupLabel>
	);
}
