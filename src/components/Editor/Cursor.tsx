import {
  type CursorOverlayData,
  useRemoteCursorOverlayPositions,
} from "@slate-yjs/react";
import { useRef } from "react";

export type CursorData = {
  name: string;
  color: string;
};

/**
 * Hiển thị con trỏ chuột của những người dùng khác đang truy cập tài liệu này
 */
export function Cursors({ children }: { children: React.ReactNode }) {
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

function Selection({
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

type CaretProps = Pick<CursorOverlayData<CursorData>, "caretPosition" | "data">;

function Caret({ caretPosition, data }: CaretProps) {
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
