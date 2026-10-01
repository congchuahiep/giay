import {
	Field as FormField,
	type FormSchema,
	type FormStore,
	type PartialValues,
	type PathValue,
	type RequiredPath,
	type ValidPath,
} from "@formisch/react";
import type * as v from "valibot";
import { Field, Input } from "../ui";

interface InputFieldProps<
	TSchema extends FormSchema = FormSchema,
	TFieldPath extends RequiredPath = RequiredPath,
> extends Omit<
		React.ComponentProps<typeof Input>,
		"name" | "value" | "onChange" | "ref"
	> {
	/**
	 * Form store từ useForm
	 */
	of: FormStore<TSchema>;

	/**
	 * Path đến field trong schema
	 */
	path: ValidPath<v.InferInput<TSchema>, TFieldPath>;

	/**
	 * Label hiển thị
	 */
	label?: string;

	/**
	 * Description
	 */
	description?: string;

	/**
	 * Placeholder khi chưa chọn
	 */
	placeholder?: string;

	/**
	 * Vô hiệu hóa
	 */
	disabled?: boolean;

	/**
	 * Class name cho Field
	 */
	className?: string;

	/**
	 * Class name cho Input
	 */
	inputClassName?: string;

	/**
	 * Hiển thị dấu * khi field bắt buộc
	 */
	required?: boolean;

	/**
	 * Hàm biến đổi giá trị string từ input sang giá trị schema.
	 * Ví dụ: chuyển string sang number hoặc null cho field number.
	 */
	transform?: (value: string) => PathValue<v.InferInput<TSchema>, TFieldPath>;

	/**
	 * Bỏ qua Field wrapper, chỉ render Input thuần
	 */
	noField?: boolean;
}

export default function InputField<
	TSchema extends FormSchema = FormSchema,
	TFieldPath extends RequiredPath = RequiredPath,
>({
	of,
	path,
	label,
	description,
	placeholder = "Nhập giá trị",
	disabled,
	className,
	inputClassName,
	required,
	transform,
	noField,
	onBlur,
	...props
}: InputFieldProps<TSchema, TFieldPath>) {
	return (
		<FormField of={of} path={path}>
			{(field) => {
				const input = (
					<Input
						{...field.props}
						{...props}
						id={field.props.name}
						value={
							(field.input ?? "") as
								| string
								| number
								| readonly string[]
								| undefined
						}
						onBlur={(e) => {
							field.props.onBlur?.();
							onBlur?.(e);
						}}
						onChange={(e) => {
							const next = transform
								? transform(e.target.value)
								: (e.target.value as PathValue<
										v.InferInput<TSchema>,
										TFieldPath
									>);
							field.onChange(
								next as PartialValues<
									PathValue<v.InferInput<TSchema>, TFieldPath>
								>,
							);
						}}
						placeholder={placeholder}
						disabled={disabled}
						aria-invalid={field.errors ? true : undefined}
						className={inputClassName}
					/>
				);

				if (noField) {
					return input;
				}

				return (
					<Field
						name={field.props.name}
						invalid={!!field.errors}
						isTouched={field.isTouched}
						isDirty={field.isDirty}
						className={className}
					>
						{label && (
							<Field.Label>
								{label}{" "}
								{required && <span className="text-destructive">*</span>}
							</Field.Label>
						)}
						{input}
						{description && (
							<Field.Description>{description}</Field.Description>
						)}
						<Field.Error
							match={!!field.errors}
							error={field.errors?.join("\n")}
						/>
					</Field>
				);
			}}
		</FormField>
	);
}
