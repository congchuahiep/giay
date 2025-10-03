import { cn } from "@/utils";

interface DropIndicatorProps {
  isTop?: boolean;
}

/**
 * Được hiển thị khi ta đang kéo thả một block nào đó lên nửa trên/dưới
 * của một block hiện tại
 */
export default function DropIndicator({ isTop = true }: DropIndicatorProps) {
  return (
    <div
      className={cn(
        "absolute left-0 right-0 h-0.5",
        "bg-blue-500 pointer-events-none",
        isTop ? "-top-0.5" : "bottom-0"
      )}
    />
  );
}