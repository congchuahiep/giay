import { Button as BaseButton } from "@base-ui/react/button";
import { tv, type VariantProps } from "tailwind-variants";
import { resolveClassName } from "@/shared/utils";

const buttonVariants = tv({
	base: [
		// color
		"bg-linear-to-b from-[color-mix(in_oklab,var(--button-bg)70%,white)]",
		"to-(--button-bg)",
		"text-(--button-color)",
		"hover:brightness-97",
		"border-(--button-bg)",
		"shadow-[inset_0_0_2px_0.5px_var(--button-border)]",
		// layout
		"inline-flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap",
		"rounded-full outline-none border",
		"text-sm",
		"cursor-pointer",
		"duration-150 transition-transform",
		"focus-visible:ring-2",
		"focus-visible:border-ring focus-visible:ring-ring/50",
		"dark:aria-invalid:ring-destructive/40",
		"[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
		"disabled:pointer-events-none disabled:opacity-50",
		"aria-invalid:border-destructive aria-invalid:ring-destructive/20",
	],
	variants: {
		variant: {
			default: [
				"[--button-bg:var(--primary)]",
				"[--button-color:var(--primary-foreground)]",
				"[--button-border:var(--color-neutral-50)]",
			],
			destructive:
				"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
			outline: ["bg-background border-border"],
			secondary: [
				"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				"border",
			],
			ghost: ["bg-transparent border-transparent", "hover:bg-secondary"],
			link: "text-primary underline-offset-4 hover:underline",
		},
		size: {
			default: "h-7 px-3 has-[>svg]:px-2.5 active:scale-98  min-w-16",
			sm: "h-6 px-3 has-[>svg]:px-2.5 active:scale-98",
			lg: "h-8 px-6 text-[15px] [&_svg:not([class*='size-'])]:size-5 has-[>svg]:px-4 active:scale-99",
			icon: "size-7 active:scale-97",
			"icon-sm": "size-6 active:scale-95",
			"icon-lg": "size-8 active:scale-97",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

export default function Button({
	className,
	variant = "default",
	size = "default",
	...props
}: BaseButton.Props & VariantProps<typeof buttonVariants>) {
	return (
		<BaseButton
			data-slot="button"
			className={(state) =>
				buttonVariants({
					variant,
					size,
					className: resolveClassName(className, state),
				})
			}
			{...props}
		/>
	);
}

Button.variants = buttonVariants;
