"use client";

import { Drawer as DrawerBase } from "@base-ui/react/drawer";
import { IconX } from "@tabler/icons-react";
import { type ComponentProps, createContext, use } from "react";
import { cn } from "tailwind-variants";
import { resolveClassName } from "@/shared/utils";

const DrawerContext =
	createContext<DrawerBase.Root.Props["swipeDirection"]>("down");

function Provider({ ...props }: DrawerBase.Provider.Props) {
	return <DrawerBase.Provider {...props} />;
}

function Drawer({ swipeDirection = "left", ...props }: DrawerBase.Root.Props) {
	return (
		<DrawerContext value={swipeDirection}>
			<DrawerBase.Root
				data-slot="drawer"
				swipeDirection={swipeDirection}
				{...props}
			/>
		</DrawerContext>
	);
}

function Trigger({ ...props }: DrawerBase.Trigger.Props) {
	return <DrawerBase.Trigger {...props} data-slot="drawer-trigger" />;
}

function Portal({ className, ...props }: DrawerBase.Portal.Props) {
	return (
		<DrawerBase.Portal
			data-slot="drawer-portal"
			className={(state) =>
				cn("z-999 fixed", resolveClassName(className, state))
			}
			{...props}
		/>
	);
}

function Close({ ...props }: DrawerBase.Close.Props) {
	return (
		<DrawerBase.Close
			{...props}
			data-slot="drawer-close"
			className={cn(
				"absolute top-3 right-14 border cursor-pointer p-0.5 rounded-full",
				"bg-background",
			)}
		>
			<IconX />
		</DrawerBase.Close>
	);
}

function Content({ className, ...props }: DrawerBase.Content.Props) {
	return (
		<DrawerBase.Content
			data-slot="drawer-content"
			className={(state) =>
				cn(
					[
						"transition-opacity duration-300",
						"ease-[cubic-bezier(0.45,1.005,0,1.005)]",
						"group-data-nested-drawer-open/popup:opacity-0",
						"group-data-nested-drawer-swiping/popup:opacity-100",
					],
					resolveClassName(className, state),
				)
			}
			{...props}
		/>
	);
}

export const drawerPopupClassName = ({
	swipeDirection,
}: DrawerBase.Popup.State) => {
	return cn(
		"group/popup relative",
		"[--bleed:3rem] outline-1 outline-foreground/5 bg-background text-foreground dark:outline-border overflow-y-auto overscroll-contain touch-auto data-swiping:select-none",
		"data-ending-style:duration-[calc(var(--drawer-swipe-strength)*300ms)]",
		// Nested drawer stacking variables (no-ops when not nested)
		"[--peek:1rem] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-step:0.05] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--scale-base:calc(max(0,1-(var(--nested-drawers)*var(--stack-step))))] [--scale:clamp(0,calc(var(--scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--shrink:calc(1-var(--scale))] [--height:max(0px,calc(var(--drawer-frontmost-height,var(--drawer-height))-var(--bleed)))]",
		// Nested drawer overlay (::after pseudo-element)
		"after:absolute after:inset-0 after:rounded-[inherit] after:bg-transparent after:pointer-events-none after:content-[''] after:transition-[background-color] after:duration-450 after:ease-[cubic-bezier(0.32,0.72,0,1)]",
		// Nested drawer states
		"data-nested-drawer-swiping:duration-0 data-nested-drawer-open:overflow-hidden data-nested-drawer-open:after:bg-black/5",
		{
			// Shared horizontal (left & right)
			"supports-[-webkit-touch-callout:none]:[--bleed:0px] h-[99%] my-auto w-[calc(22rem+var(--bleed))] max-w-[calc(100vw-3rem+var(--bleed))] p-6 supports-[-webkit-touch-callout:none]:w-[20rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)] supports-[-webkit-touch-callout:none]:rounded-[10px]":
				swipeDirection === "left" || swipeDirection === "right",
			// Right-only (with stacking transform + transition for box-shadow)
			"rounded-l-lg -mr-(--bleed) pr-[calc(1.5rem+var(--bleed))] supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:pr-6 shadow-[-2px_0_10px_rgb(0_0_0/0.1)] data-ending-style:shadow-[-2px_0_10px_rgb(0_0_0/0)] origin-[calc(100%-var(--bleed))_50%] transform-[translateX(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-x)-var(--stack-peek-offset)-(var(--shrink)*100%)))_scale(var(--scale))] data-swiping:duration-0 [transition:transform_450ms_cubic-bezier(0.32,0.72,0,1),box-shadow_450ms_cubic-bezier(0.32,0.72,0,1)]":
				swipeDirection === "right",
			// Left-only (with stacking transform + transition for box-shadow)
			"rounded-r-lg -ml-(--bleed) pl-[calc(1.5rem+var(--bleed))] supports-[-webkit-touch-callout:none]:ml-0 supports-[-webkit-touch-callout:none]:pl-6 shadow-[2px_0_10px_rgb(0_0_0/0.1)] data-ending-style:shadow-[2px_0_10px_rgb(0_0_0/0)] origin-[var(--bleed)_50%] transform-[translateX(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-x)+var(--stack-peek-offset)+(var(--shrink)*100%)))_scale(var(--scale))] data-swiping:duration-0 [transition:transform_450ms_cubic-bezier(0.32,0.72,0,1),box-shadow_450ms_cubic-bezier(0.32,0.72,0,1)]":
				swipeDirection === "left",
			// Right enter/exit
			"data-ending-style:transform-[translateX(calc(100%-var(--bleed)+var(--viewport-padding)))] data-starting-style:transform-[translateX(calc(100%-var(--bleed)+var(--viewport-padding)))]":
				swipeDirection === "right",
			// Left enter/exit
			"data-ending-style:transform-[translateX(calc(-100%+var(--bleed)-var(--viewport-padding)))] data-starting-style:transform-[translateX(calc(-100%+var(--bleed)-var(--viewport-padding)))]":
				swipeDirection === "left",
			// Shared vertical (up & down)
			"w-full max-h-[calc(80vh+var(--bleed))] px-6":
				swipeDirection === "up" || swipeDirection === "down",
			// Down-only (with stacking transform + transitions for height & box-shadow)
			"rounded-t-2xl -mb-(--bleed) pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px)+var(--bleed))] h-(--drawer-height,auto) shadow-[0_2px_10px_rgb(0_0_0/0.1)] data-ending-style:shadow-[0_2px_10px_rgb(0_0_0/0)] origin-[50%_calc(100%-var(--bleed))] transform-[translateY(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--shrink)*var(--height))))_scale(var(--scale))] data-swiping:duration-0 data-nested-drawer-open:h-[calc(var(--height)+var(--bleed))] [transition:transform_450ms_cubic-bezier(0.32,0.72,0,1),height_450ms_cubic-bezier(0.32,0.72,0,1),box-shadow_450ms_cubic-bezier(0.32,0.72,0,1)]":
				swipeDirection === "down",
			// Up-only (with stacking transform + transitions for height & box-shadow)
			"rounded-b-2xl -mt-(--bleed) pb-6 pt-[calc(1.5rem+env(safe-area-inset-top,0px)+var(--bleed))] h-(--drawer-height,auto) shadow-[0_-2px_10px_rgb(0_0_0/0.1)] data-ending-style:shadow-[0_-2px_10px_rgb(0_0_0/0)] origin-[50%_var(--bleed)] transform-[translateY(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--shrink)*var(--height))))_scale(var(--scale))] data-swiping:duration-0 data-nested-drawer-open:h-[calc(var(--height)+var(--bleed))] [transition:transform_450ms_cubic-bezier(0.32,0.72,0,1),height_450ms_cubic-bezier(0.32,0.72,0,1),box-shadow_450ms_cubic-bezier(0.32,0.72,0,1)]":
				swipeDirection === "up",
			// Down enter/exit
			"data-ending-style:transform-[translateY(calc(100%-var(--bleed)))] data-starting-style:transform-[translateY(calc(100%-var(--bleed)))]":
				swipeDirection === "down",
			// Up enter/exit
			"data-ending-style:transform-[translateY(calc(-100%+var(--bleed)))] data-starting-style:transform-[translateY(calc(-100%+var(--bleed)))]":
				swipeDirection === "up",
		},
	);
};

function Popup({
	className,
	children,
	container,
	...props
}: DrawerBase.Popup.Props & {
	container?: DrawerBase.Portal.Props["container"];
}) {
	const dir = use(DrawerContext);

	return (
		<Portal container={container}>
			<Backdrop />
			<Viewport>
				<DrawerBase.Popup
					data-slot="drawer-popup"
					className={(state) =>
						cn(drawerPopupClassName(state), resolveClassName(className, state))
					}
					{...props}
				>
					{dir === "down" && <Handle />}
					{children}
				</DrawerBase.Popup>
			</Viewport>
		</Portal>
	);
}

function Handle({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"shrink-0 w-12 h-1 mx-auto mb-5 rounded-full bg-muted transition-opacity duration-200 group-data-nested-drawer-open/popup:opacity-0 group-data-nested-drawer-swiping/popup:opacity-100",
				className,
			)}
			{...props}
		/>
	);
}

function Viewport({ className, ...props }: DrawerBase.Viewport.Props) {
	const dir = use(DrawerContext);
	return (
		<DrawerBase.Viewport
			data-slot="drawer-viewport"
			className={(state) =>
				cn(
					"fixed flex inset-0",
					{
						"[--viewport-padding:0px] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem] items-stretch p-(--viewport-padding)":
							dir === "left" || dir === "right",
						"justify-end": dir === "right",
						"justify-start": dir === "left",
						"items-end justify-center": dir === "down",
						"items-start justify-center": dir === "up",
					},
					resolveClassName(className, state),
				)
			}
			{...props}
		/>
	);
}

function Title({ className, ...props }: DrawerBase.Title.Props) {
	const dir = use(DrawerContext);

	return (
		<DrawerBase.Title
			data-slot="drawer-title"
			className={(state) =>
				cn(
					"text-foreground text-base font-medium",
					{
						"text-center": dir === "down" || dir === "up",
					},
					resolveClassName(className, state),
				)
			}
			{...props}
		/>
	);
}

function Description({ className, ...props }: DrawerBase.Description.Props) {
	const dir = use(DrawerContext);

	return (
		<DrawerBase.Description
			data-slot="drawer-description"
			className={(state) =>
				cn(
					"mt-1.5 text-muted-foreground text-sm",
					{
						"text-center": dir === "down" || dir === "up",
					},
					resolveClassName(className, state),
				)
			}
			{...props}
		/>
	);
}

function Backdrop({ className, ...props }: DrawerBase.Backdrop.Props) {
	return (
		<DrawerBase.Backdrop
			data-slot="drawer-backdrop"
			className={(state) =>
				cn(
					"[--backdrop-opacity:0.2] [--bleed:3rem] dark:[--backdrop-opacity:0.7] fixed inset-0 min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:duration-0 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] supports-[-webkit-touch-callout:none]:absolute supports-backdrop-filter:backdrop-blur-3xl",
					resolveClassName(className, state),
				)
			}
			{...props}
		/>
	);
}

function IndentBackground({
	className,
	...props
}: DrawerBase.IndentBackground.Props) {
	return (
		<DrawerBase.IndentBackground
			data-slot="drawer-indent-background"
			className={(state) =>
				cn(
					"isolate absolute inset-0 bg-foreground/70",
					resolveClassName(className, state),
				)
			}
			{...props}
		/>
	);
}

function Indent({ className, ...props }: DrawerBase.Indent.Props) {
	return (
		<DrawerBase.Indent
			className={(state) =>
				cn(
					"bg-background [--indent-progress:var(--drawer-swipe-progress)] [--indent-radius:calc(1rem*(1-var(--indent-progress)))] [--indent-transition:calc(1-clamp(0,calc(var(--drawer-swipe-progress)*100000),1))] relative border p-4 [transition:transform_0.4s_cubic-bezier(0.32,0.72,0,1),border-radius_0.25s_cubic-bezier(0.32,0.72,0,1)] origin-[center_top] will-change-transform transform-[scale(1)_translateY(0)] duration-[calc(400ms*var(--indent-transition)),calc(250ms*var(--indent-transition))] data-active:transform-[scale(calc(0.98+(0.02*var(--indent-progress))))_translateY(calc(0.5rem*(1-var(--indent-progress))))] data-active:rounded-tl-(--indent-radius) data-active:rounded-tr-(--indent-radius)",
					resolveClassName(className, state),
				)
			}
			{...props}
		/>
	);
}

Drawer.Provider = Provider;
Drawer.Backdrop = Backdrop;
Drawer.Close = Close;
Drawer.Content = Content;
Drawer.Description = Description;
Drawer.Popup = Popup;
Drawer.Portal = Portal;
Drawer.Title = Title;
Drawer.Trigger = Trigger;
Drawer.Viewport = Viewport;
Drawer.Handle = Handle;
Drawer.IndentBackground = IndentBackground;
Drawer.Indent = Indent;

export default Drawer;
