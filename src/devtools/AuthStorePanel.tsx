"use client";

import { useAuthStore } from "@/features/auth";

export default function AuthStorePanel() {
	const { isAuthenticated, user, initialized } = useAuthStore();

	return (
		<div
			style={{
				padding: 16,
				fontFamily: "ui-monospace, monospace",
				fontSize: 13,
			}}
		>
			<h3 className="h-8!">Auth Store</h3>

			<div
				style={{
					background: "#1a1a1a",
					color: "#e0e0e0",
					padding: 12,
					borderRadius: 6,
					overflow: "auto",
				}}
			>
				<div style={{ marginBottom: 6 }}>
					<span style={{ color: "#888" }}>isAuthenticated: </span>
					<span style={{ color: isAuthenticated ? "#4ade80" : "#f87171" }}>
						{String(isAuthenticated)}
					</span>
				</div>
				<div style={{ marginBottom: 6 }}>
					<span style={{ color: "#888" }}>initialized: </span>
					<span style={{ color: initialized ? "#4ade80" : "#f87171" }}>
						{String(initialized)}
					</span>
				</div>
				<div>
					<span style={{ color: "#888" }}>user: </span>
					<span style={{ color: user ? "#e0e0e0" : "#666" }}>
						{user ? JSON.stringify(user, null, 2) : "null"}
					</span>
				</div>
			</div>

			<div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
				<button
					type="button"
					onClick={() => void useAuthStore.getState().init()}
					style={buttonStyle}
				>
					Call init()
				</button>
				<button
					type="button"
					onClick={() =>
						useAuthStore.getState().setUser({
							id: "1",
							email: "test@test.com",
							name: "Test User",
						})
					}
					style={buttonStyle}
				>
					Mock setUser
				</button>
				<button
					type="button"
					onClick={() => useAuthStore.getState().clearUser()}
					style={buttonStyle}
				>
					clearUser()
				</button>
			</div>
		</div>
	);
}

const buttonStyle: React.CSSProperties = {
	padding: "6px 12px",
	fontSize: 12,
	borderRadius: 4,
	border: "1px solid #444",
	background: "#2a2a2a",
	color: "#e0e0e0",
	cursor: "pointer",
};
