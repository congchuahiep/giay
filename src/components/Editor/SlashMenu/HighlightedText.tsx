import { type FuseResultMatch } from "fuse.js";

interface HighlightedTextProps {
  text: string;
  matches?: readonly FuseResultMatch[];
  fieldKey: string;
  className?: string;
}

export function HighlightedText({
  text,
  matches = [],
  fieldKey,
  className = "",
}: HighlightedTextProps) {
  // Tìm matches cho field hiện tại
  const fieldMatches = matches.find((match) => match.key === fieldKey);

  if (!fieldMatches || !fieldMatches.indices.length) {
    return <span className={className}>{text}</span>;
  }

  // Tạo các đoạn text với highlight
  const segments: Array<{ text: string; highlighted: boolean }> = [];
  let lastIndex = 0;

  fieldMatches.indices.forEach(([start, end]) => {
    // Thêm text trước match
    if (start > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, start),
        highlighted: false,
      });
    }

    // Thêm matched text
    segments.push({
      text: text.slice(start, end + 1),
      highlighted: true,
    });

    lastIndex = end + 1;
  });

  // Thêm text còn lại
  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      highlighted: false,
    });
  }

  return (
    <span className={className}>
      {segments.map((segment, index) => (
        <span
          key={index}
          className={segment.highlighted ? "bg-yellow-200 font-semibold" : ""}
        >
          {segment.text}
        </span>
      ))}
    </span>
  );
}
