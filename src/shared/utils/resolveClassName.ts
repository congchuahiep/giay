export default function resolveClassName<S>(
	className: string | ((state: S) => string | undefined) | undefined,
	state: S,
): string | undefined {
	return typeof className === "function" ? className(state) : className;
}
