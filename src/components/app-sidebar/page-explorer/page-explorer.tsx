import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { cn } from "@/utils";
import PageCreateButton from "./page-create-button";
import PageList from "./page-list";

/**
 * Component hiển thị sidebar danh sách các trang trong workspace dưới dạng cấu
 * trúc cây. Bao gồm nút tạo trang mới và danh sách các trang gốc, cho phép mở
 * rộng để xem các trang con.
 */
export default function PageExplorer() {
	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel className={cn("dark:text-stone-300d")}>
				Pages
			</SidebarGroupLabel>
			<PageCreateButton />
			<PageList />
		</SidebarGroup>
	);
}
