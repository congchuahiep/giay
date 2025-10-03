import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api, endpoint } from "@/configs/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";
import { v4 as uuidv4 } from "uuid";

export default function CreateWorkspaceDialog({
	open,
	onCreated,
}: {
	open: boolean;
	onCreated: () => void;
}) {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { token } = useAuthStore();

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await api.post(
				endpoint.workspaces.create,
				{
					id: uuidv4(),
					name,
				},
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			setName("");
			onCreated();
			navigate(".", { replace: true });
		} catch (err: any) {
			console.error(err);
			setError(err?.response?.data?.detail || "Create failed!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open}>
			<DialogContent>
				<DialogTitle>Create new workspace</DialogTitle>
				<form onSubmit={handleCreate} className="space-y-4">
					<Input
						placeholder="Workspace name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					{error && <div className="text-red-500 text-sm">{error}</div>}
					<Button
						type="submit"
						disabled={loading || !name.trim()}
						className="w-full"
					>
						{loading ? "Creating..." : "Create"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
