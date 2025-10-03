import { useEffect } from "react";
import { useShortcut } from "./stores";
import type { ShortcutExtension } from "./types";

/**
 * Hook này được sử dụng để đăng ký các phím tắt với một scope cụ thể.
 *
 * @param scope - Tên scope để đăng ký (ví dụ: "editor", "sidebar", "global"), nếu
 * không để, hoặc để là "global" thì tức bộ phím tắt này hoạt động toàn cục
 * @param context - Ngữ cảnh để truyền vào các action của extension
 * @param extensions - Mảng các extension để đăng ký
 */
export function useRegisterShortcuts<T = any>(
	context: T,
	extensions: ShortcutExtension<T>[],
): void {
	const { registerExtension, unregisterExtension } = useShortcut();

	// Đăng ký bộ shortcut khi component mount
	// biome-ignore lint/correctness/useExhaustiveDependencies: suppress dependency extensions
	useEffect(() => {
		const scopedExtensions = extensions.map((ext) => ({
			...ext,
		}));

		// biome-ignore lint/suspicious/useIterableCallbackReturn: What?
		scopedExtensions.forEach((extension) =>
			registerExtension({
				...extension,
				context,
			}),
		);

		return () => {
			// biome-ignore lint/suspicious/useIterableCallbackReturn: What? #2
			scopedExtensions.forEach((extension) =>
				unregisterExtension(extension.name),
			);
		};
	}, [context, registerExtension, unregisterExtension]);
}
