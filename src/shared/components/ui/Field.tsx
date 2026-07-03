import { Field as BaseField } from "@base-ui/react/field";
import { useMemo } from "react";
import { cn } from "tailwind-variants";

type RHFMappingField = {
	isTouched?: BaseField.Root.Props["touched"];
	isDirty?: BaseField.Root.Props["dirty"];
};

function Field({
	className,
	isTouched,
	isDirty,
	...props
}: BaseField.Root.Props & RHFMappingField) {
	return (
		<BaseField.Root
			{...props}
			className={cn("flex w-full flex-col items-start gap-1", className)}
		/>
	);
}

function Label({ className, ...props }: BaseField.Label.Props) {
	return (
		<BaseField.Label
			{...props}
			className={cn("text-sm font-medium", className)}
		/>
	);
}

function Description({ className, ...props }: BaseField.Description.Props) {
	return (
		<BaseField.Description
			{...props}
			className={cn("text-sm font-normal text-secondary-foreground", className)}
		/>
	);
}

// biome-ignore lint/suspicious/noShadowRestrictedNames: Thích?
function Error({
	className,
	error,
	children,
	...props
}: BaseField.Error.Props & {
	error?: string | undefined;
}) {
	const content = useMemo(() => {
		if (children) {
			return children;
		}

		const errors = error?.split("\n");

		if (!errors?.length) {
			return null;
		}

		if (errors.length === 1) {
			return errors[0];
		}

		return (
			<ul className="ml-4 flex list-disc flex-col gap-1">
				{errors.map(
					(error, index) =>
						// biome-ignore lint/suspicious/noArrayIndexKey: Kệ
						error && <li key={index}>{error}</li>,
				)}
			</ul>
		);
	}, [children, error]);

	return (
		<BaseField.Error
			{...props}
			className={cn("text-sm font-normal text-destructive", className)}
		>
			{content}
		</BaseField.Error>
	);
}

function Item(props: BaseField.Item.Props) {
	return <BaseField.Item {...props} />;
}

Field.Label = Label;
Field.Description = Description;
Field.Error = Error;
Field.Item = Item;

export default Field;
