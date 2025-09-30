/**
 * Chuyển đổi sự kiện bàn phím thành chuỗi phím tắt.
 * Ví dụ: Ctrl+Shift+S -> "mod+shift+s"
 * @param event Sự kiện bàn phím
 * @returns Chuỗi phím tắt
 */
export default function getHotkeyFromEvent(event: KeyboardEvent): string {
  const keys: string[] = [];
  if (event.ctrlKey || event.metaKey) keys.push("mod");
  if (event.altKey) keys.push("alt");
  if (event.shiftKey) keys.push("shift");
  // Use event.key, but normalize to lower case and handle special keys if needed
  let key = event.key.toLowerCase();
  // Map common key aliases if needed (e.g., "arrowleft" -> "left")
  if (key === "arrowleft") key = "left";
  if (key === "arrowright") key = "right";
  if (key === "arrowup") key = "up";
  if (key === "arrowdown") key = "down";
  if (key === " ") key = "space";
  keys.push(key);
  return keys.join("+");
}
