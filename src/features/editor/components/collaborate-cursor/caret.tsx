import type { CursorOverlayData } from "@slate-yjs/react";
import type { CursorData } from "./types";

type CaretProps = Pick<CursorOverlayData<CursorData>, "caretPosition" | "data">;

export default function Caret({ caretPosition, data }: CaretProps) {
	const caretStyle = {
		...caretPosition,
		background: data?.color,
	};

	const labelStyle = {
		transform: "translateY(-100%)",
		background: data?.color,
	};

	return (
		<div style={caretStyle} className="caretMarker">
			<div className="caret" style={labelStyle}>
				{data?.name}
			</div>
		</div>
	);
}
