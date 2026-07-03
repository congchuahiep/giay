import {
	type Control,
	Controller,
	type FieldPath,
	type FieldValues,
} from "react-hook-form";
import { Field, Input } from "../ui";

interface InputFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	TTransformedValues extends FieldValues = TFieldValues,
> extends React.ComponentProps<typeof Input> {
	/**
	 * Control từ useForm
	 */
	control: Control<TFieldValues, unknown, TTransformedValues>;
	/**
	 * Tên field trong form
	 */
	name: TName;
	/**
	 *  Label hiển thị
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
}

export default function InputField<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
	TTransformedValues extends FieldValues = TFieldValues,
>({
	control,
	name,
	label,
	description,
	placeholder = "Nhập giá trị",
	disabled,
	className,
	onBlur,
	...props
}: InputFieldProps<TFieldValues, TName, TTransformedValues>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({
				field: { ref, name, value, onBlur: onBlurField, onChange },
				fieldState: { invalid, isTouched, isDirty, error },
			}) => (
				<Field
					name={name}
					invalid={invalid}
					isTouched={isTouched}
					isDirty={isDirty}
					className={className}
				>
					{label && <Field.Label>{label}</Field.Label>}
					<Input
						{...props}
						ref={ref}
						value={value}
						onBlur={(e) => {
							onBlurField();
							onBlur?.(e);
						}}
						onChange={onChange}
						placeholder={placeholder}
						disabled={disabled}
					/>
					{description && <Field.Description>{description}</Field.Description>}
					<Field.Error match={!!error} error={error?.message} />
				</Field>
			)}
		/>
	);
}
