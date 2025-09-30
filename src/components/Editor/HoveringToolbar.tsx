import { CodeIcon } from "@phosphor-icons/react/dist/icons/Code";
import { TextBIcon } from "@phosphor-icons/react/dist/icons/TextB";
import { TextItalicIcon } from "@phosphor-icons/react/dist/icons/TextItalic";
import { TextStrikethroughIcon } from "@phosphor-icons/react/dist/icons/TextStrikethrough";
import { TextUnderlineIcon } from "@phosphor-icons/react/dist/icons/TextUnderline";
import {
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Editor, Range } from "slate";
import { useFocused, useSlate } from "slate-react";
import ToggleMarkButton from "@/components/Editor/Toolbar/ToggleMarkButton";
import { cn } from "@/utils";

const HoveringToolbar = ({
	containerRef: container,
}: {
	containerRef: RefObject<HTMLDivElement | null>;
}) => {
	const ref = useRef<HTMLDivElement | null>(null);
	const editor = useSlate();
	const inFocus = useFocused();
	const [isVisible, setIsVisible] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Cập nhật vị trí toolbar
	const updateToolbarPosition = useCallback(() => {
		const currentElement = ref.current;
		if (!currentElement) return;

		const domSelection = window.getSelection();
		if (domSelection && domSelection.rangeCount > 0 && container.current) {
			const containerRect = container.current.getBoundingClientRect();

			const domRange = domSelection.getRangeAt(0);
			const rect = domRange.getBoundingClientRect();

			currentElement.style.opacity = "1";
			currentElement.style.top = `${
				rect.top - containerRect.top - currentElement.offsetHeight
			}px`;
			currentElement.style.left = `${
				rect.left -
				containerRect.left -
				currentElement.offsetWidth / 2 +
				rect.width / 2
			}px`;
		}
	}, [container]);

	// Hàm ẩn toolbar
	const hideToolbar = useCallback(() => {
		const el = ref.current;
		if (el) {
			el.removeAttribute("style");
		}
		setIsVisible(false);
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	useEffect(() => {
		const el = ref.current;
		const { selection } = editor;

		if (!el) {
			return;
		}

		// Kiểm tra điều kiện để hiển thị toolbar
		const shouldShowToolbar =
			selection &&
			inFocus &&
			!Range.isCollapsed(selection) &&
			Editor.string(editor, selection) !== "";

		if (!shouldShowToolbar) {
			hideToolbar();
			return;
		}

		// Nếu toolbar đã được hiển thị, cập nhật ngay lập tức
		if (isVisible) {
			updateToolbarPosition();
			return;
		}

		// Nếu toolbar chưa được hiển thị, delay 300ms
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			// Kiểm tra lại điều kiện sau khi delay (có thể user đã thay đổi selection)
			const currentSelection = editor.selection;
			const currentShouldShow =
				currentSelection &&
				inFocus &&
				!Range.isCollapsed(currentSelection) &&
				Editor.string(editor, currentSelection) !== "";

			if (currentShouldShow) {
				setIsVisible(true);
				updateToolbarPosition();
			}
		}, 300);

		// Cleanup function
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, [
		editor,
		editor.selection,
		inFocus,
		isVisible,
		hideToolbar,
		updateToolbarPosition,
	]);

	// Cleanup khi component unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Kệ
		<div
			ref={ref}
			className={cn(
				"p-0.5 absolute z-100 opacity-0 hover-toolbar left-[] -mt-1",
				"bg-popover shadow-md rounded-md border-1",
			)}
			onMouseDown={(e) => {
				e.preventDefault();
			}}
		>
			<ToggleMarkButton format="bold" icon={<TextBIcon weight="bold" />} />
			<ToggleMarkButton
				format="italic"
				icon={<TextItalicIcon weight="bold" />}
			/>
			<ToggleMarkButton
				format="underline"
				icon={<TextUnderlineIcon weight="bold" />}
			/>
			<ToggleMarkButton
				format="strikeThrough"
				icon={<TextStrikethroughIcon weight="bold" />}
			/>
			<ToggleMarkButton format="code" icon={<CodeIcon weight="fill" />} />
		</div>
	);
};

export default HoveringToolbar;
