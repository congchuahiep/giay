export default function scrollToDataAttribute(
  attribute: string,
  value: number,
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
) {
  if (!scrollContainerRef.current) return;

  const scrollContainer = scrollContainerRef.current;
  const selectedElement = scrollContainer.querySelector(
    `[data-${attribute}="${value}"]`
  ) as HTMLElement;

  if (selectedElement) {
    const elementTop = selectedElement.offsetTop;
    const elementBottom = elementTop + selectedElement.offsetHeight;
    const containerScrollTop = scrollContainer.scrollTop;
    const containerHeight = scrollContainer.clientHeight;

    if (elementTop < containerScrollTop) {
      scrollContainer.scrollTop = elementTop;
    } else if (elementBottom > containerScrollTop + containerHeight) {
      scrollContainer.scrollTop = elementBottom - containerHeight;
    }
  }
}
