import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { useNavigate } from "react-router-dom";
import { SidebarGroupAction } from "@/components/ui/sidebar";
import { useYjsWorkspace } from "@/features/yjs-workspace";
import { usePageCreate } from "@/services/pages";
import { cn } from "@/utils";

/**
 * Nút tạo trang mới trong workspace. Khi bấm sẽ tạo một trang mới và chuyển
 * hướng đến trang đó.
 */
export default function PageCreateButton() {
	const activeWorkspace = useYjsWorkspace((state) => state.activeWorkspace);
	const provider = useYjsWorkspace((state) => state.provider);
	const navigate = useNavigate();

	const { mutate: createPage } = usePageCreate(activeWorkspace.id, provider, {
		onSuccess: (newPage) => {
			navigate(`/${activeWorkspace.id}/${newPage.id}`);
		},
	});

	const handleCreateNewPage = async () => {
		try {
			createPage({ parentPageId: undefined });
		} catch (error) {
			console.error("Error creating new page:", error);
		}
	};

	return (
		<SidebarGroupAction
			className={cn(
				"py-0 flex items-center hover:bg-stone-300/50 rounded-md",
				"cursor-pointer opacity-0 group-hover:opacity-100 bg-transparent",
			)}
			onClick={handleCreateNewPage}
		>
			<PlusIcon className="w-4 h-4" />
		</SidebarGroupAction>
	);
}
