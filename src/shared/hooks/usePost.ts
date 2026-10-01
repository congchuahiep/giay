"use client";
import {
	type DeepPartial,
	type FormSchema,
	type FormStore,
	type SubmitEventHandler,
	reset,
	useForm,
} from "@formisch/react";
import {
	type UseMutationOptions,
	type UseMutationResult,
	useMutation,
} from "@tanstack/react-query";
import type * as v from "valibot";
import { type AppError, ValidationError } from "@/shared/errors";
import { setFormValidationErrors } from "../utils";

/**
 * Options cho hook usePost
 *
 * @template TSchema - Schema Valibot của resource (object schema)
 */
export interface UsePostOptions<
	TSchema extends FormSchema,
	TData = unknown,
	TError = AppError,
	TOnMutateResult = unknown,
> extends Pick<
		UseMutationOptions<TData, TError, v.InferOutput<TSchema>, TOnMutateResult>,
		"onMutate" | "onSuccess" | "onError" | "onSettled" | "mutationFn"
	> {
	/**
	 * Schema Valibot để validate form
	 */
	schema: TSchema;

	/**
	 * Giá trị mặc định cho form (partial được phép)
	 */
	initialInput?: DeepPartial<v.InferInput<TSchema>>;

	/**
	 * Chế độ validate lần đầu (mặc định: 'submit')
	 */
	validate?: "initial" | "touch" | "input" | "change" | "blur" | "submit";

	/**
	 * Chế độ revalidate sau lần đầu (mặc định: 'input')
	 */
	revalidate?: "touch" | "input" | "change" | "blur" | "submit";

	/**
	 * Có reset form sau khi mutation thành công không?
	 *
	 * Đặt `false` nếu muốn giữ lại giá trị form
	 * (ví dụ: flow "Thêm tiếp", edit-in-place).
	 *
	 * @default true
	 */
	resetOnSuccess?: boolean;

	/**
	 * Các tùy chọn bổ sung cho useMutation
	 */
	mutationOptions?: Omit<
		UseMutationOptions<TData, TError, v.InferOutput<TSchema>, TOnMutateResult>,
		"mutationFn" | "onMutate" | "onSuccess" | "onError" | "onSettled"
	>;
}

/**
 * Kết quả trả về từ hook usePost
 */
export interface UsePostReturn<
	TSchema extends FormSchema,
	TData = unknown,
	TError = AppError,
> {
	/**
	 * Form store từ Formisch
	 */
	form: FormStore<TSchema>;

	/**
	 * Trigger mutation
	 */
	mutate: UseMutationResult<TData, TError, v.InferOutput<TSchema>>["mutate"];

	/**
	 * Trigger mutation và trả về Promise
	 */
	mutateAsync: UseMutationResult<
		TData,
		TError,
		v.InferOutput<TSchema>
	>["mutateAsync"];

	/**
	 * Mutation đang chạy
	 */
	isPending: boolean;

	/**
	 * Mutation gặp lỗi
	 */
	isError: boolean;

	/**
	 * Mutation thành công
	 */
	isSuccess: boolean;

	/**
	 * Lỗi mutation nếu có
	 */
	error: TError | null;

	/**
	 * Dữ liệu trả về từ mutation nếu thành công
	 */
	data: TData | undefined;

	/**
	 * Trạng thái mutation
	 */
	status: UseMutationResult<TData, TError, v.InferOutput<TSchema>>["status"];

	/**
	 * Handler để submit form - validate và trigger mutation
	 * Dùng trực tiếp cho prop `onSubmit` của Formisch `<Form>`
	 */
	handleSubmit: SubmitEventHandler<TSchema>;

	/**
	 * Reset form và mutation
	 */
	reset: () => void;

	/**
	 * Reset trạng thái form (không reset mutation)
	 */
	resetForm: () => void;

	/**
	 * Reset trạng thái mutation (không reset form)
	 */
	resetMutation: () => void;
}

/**
 * Custom hook kết hợp Formisch, TanStack Query và Valibot
 * dùng để thực hiện tạo mới dữ liệu (POST request) với form validation.
 *
 * Hook này quản lý đồng thời state của form (thông qua Formisch)
 * và mutation (thông qua TanStack Query), giúp việc xử lý submit form
 * trở nên đơn giản và nhất quán hơn.
 *
 * **Lưu ý:** Không nên dùng hook này cho các trường hợp:
 * - API không liên quan đến form (ví dụ: gọi API để lấy dữ liệu rồi cập
 * nhật state)
 * - API không có request body (nên dùng useMutation trực tiếp)
 *
 * @example
 * ```tsx
 * const CreateWorkspaceSchema = v.object({
 *   name: v.pipe(v.string(), v.minLength(3)),
 *   description: v.optional(v.string()),
 * });
 *
 * function CreateWorkspaceForm() {
 *   const { form, handleSubmit, isPending } = usePost({
 *     schema: CreateWorkspaceSchema,
 *     initialInput: { name: '', description: '' },
 *     mutationFn: (data) => api.post('/workspaces', data),
 *     onSuccess: (data) => {
 *       toast.success('Tạo thành công!');
 *       router.push(`/workspaces/${data.slug}`);
 *     },
 *   });
 *
 *   return (
 *     <Form of={form} onSubmit={handleSubmit}>
 *       <Field of={form} path={['name']}>
 *         {(field) => (
 *           <div>
 *             <input {...field.props} value={field.input} />
 *             {field.errors && <div>{field.errors[0]}</div>}
 *           </div>
 *         )}
 *       </Field>
 *
 *       <button type="submit" disabled={isPending}>
 *         {isPending ? 'Đang tạo...' : 'Tạo mới'}
 *       </button>
 *     </Form>
 *   );
 * }
 * ```
 */
export default function usePost<
	/**
	 * Định nghĩa schema cho form và mutation
	 */
	TSchema extends FormSchema,
	/**
	 * Kiểu dữ liệu trả về từ mutation
	 */
	TData = unknown,
	TError = AppError,
	TOnMutateResult = unknown,
>(
	options: UsePostOptions<TSchema, TData, TError, TOnMutateResult>,
): UsePostReturn<TSchema, TData, TError> {
	const {
		schema,
		initialInput,
		validate,
		revalidate,
		resetOnSuccess = true,
		mutationFn,
		mutationOptions = {},
		onMutate,
		onSuccess,
		onError,
		onSettled,
	} = options;

	const form = useForm({
		schema,
		initialInput,
		validate,
		revalidate,
	});

	const mutation = useMutation<
		TData,
		TError,
		v.InferOutput<TSchema>,
		TOnMutateResult
	>({
		mutationFn,
		...mutationOptions,
		onMutate,
		onSuccess: (...args) => {
			if (resetOnSuccess) reset(form);
			onSuccess?.(...args);
		},
		onError: (error, ...args) => {
			if (error instanceof ValidationError)
				setFormValidationErrors(form, error);

			onError?.(error, ...args);
		},
		onSettled,
	});

	const handleSubmit: SubmitEventHandler<TSchema> = async (output) => {
		try {
			await mutation.mutateAsync(output);
		} catch {
			// Lỗi đã được mutation.onError xử lý (map ValidationError vào form,
			// hoặc để lại trong mutation.error cho UI hiển thị)
		}
	};

	const handleReset = () => {
		reset(form);
		mutation.reset();
	};

	return {
		form,

		mutate: mutation.mutate,
		mutateAsync: mutation.mutateAsync,
		isPending: mutation.isPending,
		isError: mutation.isError,
		isSuccess: mutation.isSuccess,
		error: mutation.error,
		data: mutation.data,
		status: mutation.status,
		resetMutation: () => mutation.reset(),

		handleSubmit,
		reset: handleReset,
		resetForm: () => reset(form),
	};
}
