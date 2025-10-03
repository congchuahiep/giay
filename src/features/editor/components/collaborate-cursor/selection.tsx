import type { CursorOverlayData } from "@slate-yjs/react";
import Caret from "./caret";
import type { CursorData } from "./types";

export default function Selection({
	data,
	selectionRects,
	caretPosition,
}: CursorOverlayData<CursorData>) {
	if (!data) {
		return null;
	}

	const selectionStyle = {
		backgroundColor: data.color,
	};

	return (
		<>
			{selectionRects.map((position, i) => (
				<div
					style={{ ...selectionStyle, ...position }}
					className="selection"
					key={i}
				/>
			))}
			{caretPosition && <Caret caretPosition={caretPosition} data={data} />}
		</>
	);
}
