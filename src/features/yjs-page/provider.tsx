import { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageQuery } from "@/services/pages";
import { useAuthStore } from "@/stores/auth";
import type { YjsConnectStatus } from "@/types";
import { YjsPageContext } from "./context";
import { createYjsPageStore } from "./store";

const YJS_PAGE_URL = import.meta.env.VITE_YJS_PAGE_SERVER;
interface YjsPageProviderProps {
	pageId: string;
	children: React.ReactNode;
}

export const YjsPageProvider = ({ pageId, children }: YjsPageProviderProps) => {
	const { token } = useAuthStore();
	const { data: pageData, isFetching, isError, error } = usePageQuery(pageId);
	const [status, setStatus] = useState<YjsConnectStatus>("connecting");

	const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

	useEffect(() => {
		if (!pageData) return;

		setStatus("connecting");
		const provider = new HocuspocusProvider({
			url: YJS_PAGE_URL,
			name: pageData.id,
			document: pageData.page_data,
		});

		provider.on("synced", () => {
			setStatus("connected");
		});

		provider.on("disconnect", () => {
			setStatus("disconnected");
		});

		setProvider(provider);

		return () => {
			setStatus("disconnected");
			provider.removeAllListeners();
			provider.disconnect();
			setProvider(null);
		};
	}, [pageData]);

	if (isFetching) {
		return <PageLoading />;
	}

	if (isError || !provider) {
		return (
			<div>Error: {error?.message || "Unknown error! provider not found"}</div>
		);
	}

	if (!pageData) {
		return <div>Page not found</div>;
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
};

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
