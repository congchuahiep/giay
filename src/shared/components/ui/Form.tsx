import { Form as BaseForm } from "@base-ui/react/form";
import { cn } from "tailwind-variants";

function Form({ className, ...props }: BaseForm.Props) {
	return (
		<BaseForm
			method="post"
			className={cn("flex w-full flex-col gap-4", className)}
			{...props}
		/>
	);
}

export default Form;
