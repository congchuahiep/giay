import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface BlockOverlayProps {
	blockElements: HTMLElement[];
}

interface OverlayRect {
	top: number;
	left: number;
	width: number;
	height: number;
}

/**
 * Hiển thị block overlay khi selection
 */
export default function BlockSelectionOverlay({ blockElements }: BlockOverlayProps) {
	const [overlayRects, setOverlayRects] = useState<OverlayRect[]>([]);

	useEffect(() => {
		if (blockElements.length === 0) {
			setOverlayRects([]);
			return;
		}

		const updateOverlayPositions = () => {
			const rects: OverlayRect[] = [];

			blockElements.forEach((element) => {
				const rect = element.getBoundingClientRect();
				const scrollX =
					window.pageXOffset || document.documentElement.scrollLeft;
				const scrollY =
					window.pageYOffset || document.documentElement.scrollTop;

				rects.push({
					top: rect.top + scrollY,
					left: rect.left + scrollX,
					width: rect.width,
					height: rect.height,
				});
			});

			setOverlayRects(rects);
		};

		// Update positions immediately
		updateOverlayPositions();

		// Update on scroll/resize
		window.addEventListener("scroll", updateOverlayPositions);
		window.addEventListener("resize", updateOverlayPositions);

		return () => {
			window.removeEventListener("scroll", updateOverlayPositions);
			window.removeEventListener("resize", updateOverlayPositions);
		};
	}, [blockElements]);

	if (overlayRects.length === 0) {
		return null;
	}

	return createPortal(
		<>
			{overlayRects.map((rect, index) => (
				<div
					key={index}
					className="absolute bg-blue-400/15 rounded-xs box-border pointer-events-none"
					style={{
						top: rect.top,
						left: rect.left,
						width: rect.width,
						height: rect.height - 2,
						pointerEvents: "none",
					}}
				/>
			))}
		</>,
		document.body
	);
}
