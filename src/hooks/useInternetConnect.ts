import { useEffect, useState } from "react";

/**
 * Hook dùng để kiểm tra trạng thái kết nối mạng của người dùng.
 * @returns {boolean} - True nếu người dùng đang online, false nếu không.
 */
export default function useInternetConnect(): boolean {
	const [isOnline, setIsOnline] = useState(navigator.onLine);

	useEffect(() => {
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	return isOnline;
}
