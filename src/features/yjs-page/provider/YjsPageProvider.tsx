import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagePreviewQuery, usePageQuery } from "@/services/pages";
import { useAuthStore } from "@/stores/auth";
import type { Page, YjsConnectStatus } from "@/types";
import { YjsPageContext } from "../context";
import { createYjsPageStore } from "../store";

const YJS_PAGE_URL = import.meta.env.VITE_YJS_PAGE_SERVER;

interface YjsPageProviderProps {
	pageId: string;
	children: React.ReactNode;
}

export default function YjsPageProvider({
	pageId,
	children,
}: YjsPageProviderProps) {
	const { token } = useAuthStore();

	const { data: localPageData, isFetching, error } = usePageQuery(pageId);
	const { refetch: fetchPagePreview } = usePagePreviewQuery(pageId, {
		enabled: false,
	});
	const [status, setStatus] = useState<YjsConnectStatus>("connecting");

	const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

	const [pageData, setPageData] = useState<Page | null>(null);

	useEffect(() => {
		if (isFetching) return;

		setStatus("connecting");
		const provider = new HocuspocusProvider({
			url: YJS_PAGE_URL,
			name: pageId,
			document: localPageData?.page_data, // Nếu page_data không có thì để yjs provider server tự fetch
			token: token,
		});

		// Đăng ký các sự kiện cho provider
		provider.on("synced", async () => {
			// fetch dữ liệu metadata của trang nếu như không có dữ liệu local
			if (!localPageData)
				fetchPagePreview()
					.then((res) => {
						const data = res.data;
						if (!data) throw new Error("Page not found");
						console.log("server page", data);
						setPageData({
							id: pageId,
							title: data.title,
							icon: data.icon,
							page_data: provider.document,
							parent_page_id: data?.parent_page_id,
							is_deleted: data?.is_deleted,
						});
					})
					.catch((err) => {
						console.error("Error when fetch page preview: ", err);
						setPageData(null);
					});

			setStatus("connected");
		});

		provider.on("disconnect", () => {
			setStatus("disconnected");
		});

		// Thiết lập dữ liệu sẵn (không cần phải chờ sync) cho trang nếu như lấy
		// được dữ liệu local
		if (localPageData) {
			console.log("localPageData", localPageData);
			setPageData({
				id: pageId,
				title: localPageData.title,
				icon: localPageData.icon,
				page_data: provider.document,
				parent_page_id: localPageData?.parent_page_id,
				is_deleted: localPageData?.is_deleted,
			});
			setStatus("local-ready");
		}

		setProvider(provider);

		return () => {
			setStatus("disconnected");
			provider.removeAllListeners();
			provider.disconnect();
			setProvider(null);
			setPageData(null);
		};
	}, [localPageData, token, pageId, isFetching, fetchPagePreview]);

	useEffect(() => {
		if (error) toast.error(error.message);
	}, [error]);

	if (isFetching) {
		return <PageLoading />;
	}

	// if (isError) {
	// 	return (
	// 		<div>Error: {error?.message || "Unknown error! provider not found"}</div>
	// 	);
	// }

	if (!provider) {
		return <div>Page not found</div>;
	}

	if (!pageData || status === "connecting") {
		return <PageLoading />;
	}

	return (
		<YjsPageContext.Provider
			value={createYjsPageStore({
				currentPage: { ...pageData, children: [] },
				provider,
				status,
			})}
		>
			{children}
		</YjsPageContext.Provider>
	);
}

function PageLoading() {
	return (
		<div className="flex flex-col gap-2 mt-20">
			<Skeleton className="w-full h-[120px]" />
			<Skeleton className="w-full h-[24px] opacity-80" />
			<Skeleton className="w-full h-[24px] opacity-60" />
			<Skeleton className="w-full h-[24px] opacity-40" />
			<Skeleton className="w-full h-[24px] opacity-20" />
			<Skeleton className="w-full h-[24px] opacity-5" />
		</div>
	);
}
