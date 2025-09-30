import { useEffect } from "react";
import type { ShortcutExtension } from "@/core/shortcut";
import { useShortcutStore } from "../store/useShortcutStore";

/**
 * Hook này được sử dụng để đăng ký các phím tắt với một scope cụ thể.
 *
 * @param scope - Tên scope để đăng ký (ví dụ: "editor", "sidebar", "global"), nếu
 * không để, hoặc để là "global" thì tức bộ phím tắt này hoạt động toàn cục
 * @param context - Ngữ cảnh để truyền vào các action của extension
 * @param extensions - Mảng các extension để đăng ký
 */
export default function useRegisterShortcuts<T = any>(
	scope: string,
	context: T,
	extensions: ShortcutExtension<T>[],
): void {
	const { registerExtension, unregisterExtension } = useShortcutStore();

	// Đăng ký bộ shortcut khi component mount
	// biome-ignore lint/correctness/useExhaustiveDependencies: suppress dependency extensions
	useEffect(() => {
		const scopedExtensions = extensions.map((ext) => ({
			...ext,
			scope,
		}));

		// biome-ignore lint/suspicious/useIterableCallbackReturn: What?
		scopedExtensions.forEach((extension) =>
			registerExtension({
				...extension,
				scope,
				context,
			}),
		);

		return () => {
			// biome-ignore lint/suspicious/useIterableCallbackReturn: What? #2
			scopedExtensions.forEach((extension) =>
				unregisterExtension(extension.name),
			);
		};
	}, [scope, context]);
}
