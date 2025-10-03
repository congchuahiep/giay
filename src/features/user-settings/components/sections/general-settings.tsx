import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function GeneralSettings() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">General Settings</h2>
				<p className="text-muted-foreground">
					Manage your basic application preferences.
				</p>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="language">Language</Label>
					<Select defaultValue="en">
						<SelectTrigger id="language" className="w-full sm:w-[250px]">
							<SelectValue placeholder="Select language" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="en">English</SelectItem>
							<SelectItem value="fr">French</SelectItem>
							<SelectItem value="de">German</SelectItem>
							<SelectItem value="es">Spanish</SelectItem>
							<SelectItem value="vi">Vietnamese</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="timezone">Timezone</Label>
					<Select defaultValue="utc_7">
						<SelectTrigger id="timezone" className="w-full sm:w-[250px]">
							<SelectValue placeholder="Select timezone" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="utc_0">UTC (GMT+0)</SelectItem>
							<SelectItem value="utc_7">UTC+7 (Vietnam)</SelectItem>
							<SelectItem value="utc_8">UTC+8 (China, Singapore)</SelectItem>
							<SelectItem value="utc_9">UTC+9 (Japan, Korea)</SelectItem>
							<SelectItem value="utc_-5">UTC-5 (Eastern US)</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="date-format">Date Format</Label>
					<Select defaultValue="dd_mm_yyyy">
						<SelectTrigger id="date-format" className="w-full sm:w-[250px]">
							<SelectValue placeholder="Select date format" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="dd_mm_yyyy">DD/MM/YYYY</SelectItem>
							<SelectItem value="mm_dd_yyyy">MM/DD/YYYY</SelectItem>
							<SelectItem value="yyyy_mm_dd">YYYY-MM-DD</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center justify-between pt-3">
					<div>
						<Label htmlFor="auto-update">Auto Update</Label>
						<p className="text-sm text-muted-foreground">
							Automatically download and install updates
						</p>
					</div>
					<Switch id="auto-update" defaultChecked />
				</div>

				<div className="flex items-center justify-between pt-3">
					<div>
						<Label htmlFor="collect-analytics">Collect Analytics</Label>
						<p className="text-sm text-muted-foreground">
							Help us improve by sending anonymous usage data
						</p>
					</div>
					<Switch id="collect-analytics" defaultChecked />
				</div>

				<div className="flex items-center justify-between pt-3">
					<div>
						<Label htmlFor="startup">Open at startup</Label>
						<p className="text-sm text-muted-foreground">
							Start this app when your system boots
						</p>
					</div>
					<Switch id="startup" />
				</div>
			</div>
		</div>
	);
}
