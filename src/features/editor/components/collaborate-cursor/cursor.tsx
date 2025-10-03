import { useRemoteCursorOverlayPositions } from "@slate-yjs/react";
import { useRef } from "react";
import Selection from "./selection";
import type { CursorData } from "./types";

/**
 * Hiển thị con trỏ chuột của những người dùng khác đang truy cập tài liệu này
 */
export default function Cursors({ children }: { children: React.ReactNode }) {
	const containerRef = useRef<HTMLDivElement>(null!);
	const [cursors] = useRemoteCursorOverlayPositions<CursorData>({
		containerRef,
	});

	return (
		<div className="cursors" ref={containerRef}>
			{children}
			{cursors.map((cursor) => (
				<Selection key={cursor.clientId} {...cursor} />
			))}
		</div>
	);
}
