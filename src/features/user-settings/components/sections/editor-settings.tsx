import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function EditorSettings() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Editor Settings</h2>
				<p className="text-muted-foreground">
					Customize your writing and editing experience.
				</p>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="default-format">Default Format</Label>
					<Select defaultValue="markdown">
						<SelectTrigger id="default-format" className="w-full sm:w-[250px]">
							<SelectValue placeholder="Select default format" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="markdown">Markdown</SelectItem>
							<SelectItem value="rich-text">Rich Text</SelectItem>
							<SelectItem value="plain-text">Plain Text</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center justify-between pt-3">
					<div>
						<Label htmlFor="auto-save">Auto Save</Label>
						<p className="text-sm text-muted-foreground">
							Automatically save your work while typing
						</p>
					</div>
					<Switch id="auto-save" defaultChecked />
				</div>

				<div className="space-y-2 pt-4">
					<div className="flex items-center justify-between">
						<Label htmlFor="auto-save-interval">
							Auto Save Interval (seconds)
						</Label>
						<span className="text-sm text-muted-foreground">30s</span>
					</div>
					<Slider
						id="auto-save-interval"
						defaultValue={[30]}
						min={5}
						max={120}
						step={5}
						className="w-full sm:w-[250px]"
					/>
				</div>

				<div className="flex items-center justify-between pt-3">
					<div>
						<Label htmlFor="spell-check">Spell Check</Label>
						<p className="text-sm text-muted-foreground">
							Check spelling while typing
						</p>
					</div>
					<Switch id="spell-check" defaultChecked />
				</div>

				<div className="flex items-center justify-between pt-3">
					<div>
						<Label htmlFor="auto-correct">Auto Correct</Label>
						<p className="text-sm text-muted-foreground">
							Automatically correct common typos
						</p>
					</div>
					<Switch id="auto-correct" defaultChecked />
				</div>

				<div className="flex items-center justify-between pt-3">
					<div>
						<Label htmlFor="line-numbers">Line Numbers</Label>
						<p className="text-sm text-muted-foreground">
							Show line numbers in the editor
						</p>
					</div>
					<Switch id="line-numbers" />
				</div>

				<div className="flex items-center justify-between pt-3">
					<div>
						<Label htmlFor="focus-mode">Focus Mode</Label>
						<p className="text-sm text-muted-foreground">
							Hide UI elements while writing
						</p>
					</div>
					<Switch id="focus-mode" />
				</div>

				<div className="space-y-2 pt-4">
					<Label htmlFor="tab-size">Tab Size</Label>
					<Select defaultValue="2">
						<SelectTrigger id="tab-size" className="w-full sm:w-[250px]">
							<SelectValue placeholder="Select tab size" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="2">2 spaces</SelectItem>
							<SelectItem value="4">4 spaces</SelectItem>
							<SelectItem value="8">8 spaces</SelectItem>
							<SelectItem value="tab">Tab character</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2 pt-4">
					<Label htmlFor="indentation">Indentation</Label>
					<Select defaultValue="spaces">
						<SelectTrigger id="indentation" className="w-full sm:w-[250px]">
							<SelectValue placeholder="Select indentation" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="spaces">Spaces</SelectItem>
							<SelectItem value="tabs">Tabs</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
}
