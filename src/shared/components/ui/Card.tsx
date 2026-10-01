import type * as React from "react";
import { cn } from "tailwind-variants";

function Card({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card"
			className={cn(
				"group/card flex flex-col p-0.75",
				"rounded-[10px] border shadow-xs",
				"bg-secondary text-card-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function Header({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"bg-muted pt-4 px-4 pb-2 border",
				"rounded-lg group-has-data-[slot='card-content']/card:rounded-b-none",
				className,
			)}
			{...props}
		/>
	);
}

function Title({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn("leading-none text-xl font-bold mb-1", className)}
			{...props}
		/>
	);
}

function Description({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

function Action({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className,
			)}
			{...props}
		/>
	);
}

function Content({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-content"
			className={cn(
				"p-4 bg-card rounded-lg",
				"rounded-lg group-has-data-[slot='card-header']/card:rounded-t-none",
				"border group-has-data-[slot='card-header']/card:border-t-0",
				className,
			)}
			{...props}
		/>
	);
}

function Footer({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
			{...props}
		/>
	);
}

Card.Action = Action;
Card.Content = Content;
Card.Description = Description;
Card.Footer = Footer;
Card.Header = Header;
Card.Title = Title;

export default Card;
