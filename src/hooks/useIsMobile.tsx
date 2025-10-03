import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = import.meta.env.MOBILE_BREAKPOINT;

/**
 * Trả về giá trị boolean cho biết thiết bị hiện tại có phải là mobile hay không,
 * dựa trên breakpoint được định nghĩa trong biến môi trường MOBILE_BREAKPOINT.
 * Hook này sẽ tự động cập nhật khi kích thước cửa sổ thay đổi.
 *
 * @returns {boolean} true nếu thiết bị là mobile, false nếu không phải.
 */
export default function useIsMobile(): boolean {
	const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

	useEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return !!isMobile;
}
