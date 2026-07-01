"use client";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
	type UseMutationOptions,
	type UseMutationResult,
	useMutation,
} from "@tanstack/react-query";
import {
	type DefaultValues,
	type UseFormProps,
	type UseFormReturn,
	useForm,
} from "react-hook-form";
import type * as v from "valibot";
import { type AppError, ValidationError } from "@/shared/errors";
import { setFormValidationErrors } from "../utils";

/**
 * Options cho hook usePost
 *
 * @template TSchema - Schema Valibot của resource (object schema)
 */
export interface UsePostOptions<
	TSchema extends v.ObjectSchema<
		v.ObjectEntries,
		v.ErrorMessage<v.ObjectIssue> | undefined
	>,
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
	 * Giá trị mặc định cho form
	 */
	defaultValues?: DefaultValues<v.InferInput<TSchema>>;

	/**
	 * Các tùy chọn bổ sung cho useMutation
	 */
	mutationOptions?: Omit<
		UseMutationOptions<TData, TError, v.InferOutput<TSchema>>,
		"mutationFn" | "onMutate" | "onSuccess" | "onError" | "onSettled"
	>;

	/**
	 * Chế độ validate form (mặc định: 'onSubmit')
	 */
	mode?: UseFormProps<v.InferInput<TSchema>>["mode"];

	/**
	 * Có reset form sau khi mutation thành công không?
	 *
	 * Đặt `false` nếu muốn giữ lại giá trị form
	 * (ví dụ: flow "Thêm tiếp", edit-in-place).
	 *
	 * @default true
	 */
	resetOnSuccess?: boolean;
}

/**
 * Kết quả trả về từ hook usePost
 */
export interface UsePostReturn<
	TSchema extends v.ObjectSchema<
		v.ObjectEntries,
		v.ErrorMessage<v.ObjectIssue> | undefined
	>,
	TData = unknown,
	TError = AppError,
> extends Omit<
			UseFormReturn<v.InferInput<TSchema>, unknown, v.InferOutput<TSchema>>,
			"handleSubmit" | "reset"
		>,
		Pick<
			UseMutationResult<TData, TError, v.InferOutput<TSchema>>,
			| "mutate"
			| "mutateAsync"
			| "isPending"
			| "isError"
			| "isSuccess"
			| "error"
			| "data"
			| "status"
		> {
	/**
	 * Handler để submit form - validate và trigger mutation
	 */
	handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;

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
 * Custom hook kết hợp React Hook Form, TanStack Query và Valibot
 * dùng để thực hiện tạo mới dữ liệu (POST request) với form validation.
 *
 * Hook này quản lý đồng thời state của form (thông qua React Hook Form)
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
 *   const { register, handleSubmit, formState: { errors }, isPending } = usePost({
 *     schema: CreateWorkspaceSchema,
 *     defaultValues: { name: '', description: '' },
 *     mutationFn: (data) => api.post('/workspaces', data),
 *     onSuccess: (data) => {
 *       toast.success('Tạo thành công!');
 *       router.push(`/workspaces/${data.slug}`);
 *     },
 *   });
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input {...register('name')} />
 *       {errors.name && <span>{errors.name.message}</span>}
 *
 *       <textarea {...register('description')} />
 *
 *       <button type="submit" disabled={isPending}>
 *         {isPending ? 'Đang tạo...' : 'Tạo mới'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */
export default function usePost<
	/**
	 * Định nghĩa schema cho form và mutation
	 */
	TSchema extends v.ObjectSchema<
		v.ObjectEntries,
		v.ErrorMessage<v.ObjectIssue> | undefined
	>,
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
		defaultValues,
		mutationFn,
		mutationOptions = {},
		mode = "onSubmit",
		resetOnSuccess = true,
		onMutate,
		onSuccess,
		onError,
		onSettled,
	} = options;

	const form = useForm<v.InferInput<TSchema>, unknown, v.InferOutput<TSchema>>({
		resolver: valibotResolver(schema),
		defaultValues,
		mode,
	});

	const mutation = useMutation<
		TData,
		TError,
		v.InferOutput<TSchema>,
		TOnMutateResult
	>({
		mutationFn,
		onMutate,
		onSuccess: (...args) => {
			if (resetOnSuccess) form.reset();
			onSuccess?.(...args);
		},
		onError: (error, ...args) => {
			if (error instanceof ValidationError)
				setFormValidationErrors(form, error);

			onError?.(error, ...args);
		},
		onSettled,
		...mutationOptions,
	});

	const handleSubmit = form.handleSubmit((data) => {
		mutation.mutate(data);
	});

	const handleReset = () => {
		form.reset();
		mutation.reset();
	};

	return {
		...form,
		resetForm: form.reset,

		mutate: mutation.mutate,
		mutateAsync: mutation.mutateAsync,
		isPending: mutation.isPending,
		isError: mutation.isError,
		isSuccess: mutation.isSuccess,
		error: mutation.error,
		data: mutation.data,
		status: mutation.status,
		resetMutation: mutation.reset,

		handleSubmit,
		reset: handleReset,
	};
}
