import { DesktopTowerIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function AppearanceSettings() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Appearance</h2>
				<p className="text-muted-foreground">
					Customize how the application looks and feels.
				</p>
			</div>

			<div className="space-y-4">
				<div>
					<h3 className="text-lg font-medium">Theme</h3>
					<RadioGroup
						defaultValue="system"
						className="grid grid-cols-3 gap-4 pt-2"
					>
						<div>
							<RadioGroupItem
								value="light"
								id="theme-light"
								className="peer sr-only"
							/>
							<Label
								htmlFor="theme-light"
								className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
							>
								<SunIcon className="mb-3 size-6" weight="fill" />
								Light
							</Label>
						</div>
						<div>
							<RadioGroupItem
								value="dark"
								id="theme-dark"
								className="peer sr-only"
							/>
							<Label
								htmlFor="theme-dark"
								className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
							>
								<MoonIcon className="mb-3 size-6" weight="fill" />
								Dark
							</Label>
						</div>
						<div>
							<RadioGroupItem
								value="system"
								id="theme-system"
								className="peer sr-only"
							/>
							<Label
								htmlFor="theme-system"
								className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
							>
								<DesktopTowerIcon className="mb-3 size-6" weight="fill" />
								System
							</Label>
						</div>
					</RadioGroup>
				</div>

				<div className="space-y-2 pt-4">
					<Label htmlFor="font-family">Font Family</Label>
					<Select defaultValue="inter">
						<SelectTrigger id="font-family" className="w-full sm:w-[250px]">
							<SelectValue placeholder="Select font" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="inter">Inter</SelectItem>
							<SelectItem value="roboto">Roboto</SelectItem>
							<SelectItem value="sf-pro">SF Pro</SelectItem>
							<SelectItem value="system">System Default</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2 pt-4">
					<div className="flex items-center justify-between">
						<Label htmlFor="font-size">Font Size</Label>
						<span className="text-sm text-muted-foreground">16px</span>
					</div>
					<Slider
						id="font-size"
						defaultValue={[16]}
						min={10}
						max={24}
						step={1}
						className="w-full sm:w-[350px]"
					/>
				</div>

				<div className="space-y-2 pt-4">
					<div className="flex items-center justify-between">
						<Label htmlFor="line-height">Line Height</Label>
						<span className="text-sm text-muted-foreground">1.5</span>
					</div>
					<Slider
						id="line-height"
						defaultValue={[1.5]}
						min={1}
						max={2}
						step={0.1}
						className="w-full sm:w-[350px]"
					/>
				</div>

				<div className="space-y-2 pt-4">
					<Label htmlFor="color-scheme">Color Scheme</Label>
					<Select defaultValue="default">
						<SelectTrigger id="color-scheme" className="w-full sm:w-[250px]">
							<SelectValue placeholder="Select color scheme" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="default">Default Blue</SelectItem>
							<SelectItem value="violet">Violet</SelectItem>
							<SelectItem value="green">Green</SelectItem>
							<SelectItem value="orange">Orange</SelectItem>
							<SelectItem value="slate">Slate</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
}
