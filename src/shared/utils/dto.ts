/** biome-ignore-all lint/suspicious/noExplicitAny: Kệ */

/**
 * Cấu hình ánh xạ cho từng field giữa DTO (snake_case) và Domain (camelCase).
 *
 * - Giá trị là `string`: ánh xạ key, giữ nguyên giá trị (không transform)
 * - Giá trị là `[string, fn]`: ánh xạ key + transform giá trị
 *
 * @template TDto   - Kiểu dữ liệu từ API (snake_case)
 * @template TDomain - Kiểu dữ liệu domain (camelCase)
 */
export type MappingConfig<TDto, TDomain> = {
	[K in keyof TDomain & string]:
		| Extract<keyof TDto, string>
		| [Extract<keyof TDto, string>, (value: any) => TDomain[K]];
};

/**
 * Tạo hàm chuyển đổi từ DTO (snake_case) sang Domain (camelCase).
 *
 * Hàm trả về hỗ trợ cả dữ liệu đầy đủ và partial:
 * - `UserProfileDTO` → `UserProfile`
 * - `Partial<UserProfileDTO>` → `Partial<UserProfile>`
 *
 * @example
 * ```ts
 * export const userProfileFromDto = createFromDto<UserProfileDTO, UserProfile>({
 *   id: 'id',
 *   email: 'email',
 *   firstName: 'first_name',
 *   lastName: 'last_name',
 *   isActive: 'is_active',
 *   dateJoined: ['date_joined', (v: string) => new Date(v)],
 * });
 *
 * // Full data
 * const user = userProfileFromDto(response.data);
 * user.firstName // string ✅
 *
 * // Partial data
 * const partial = userProfileFromDto({ id: 1, first_name: "Hiep" });
 * partial.firstName // string | undefined
 * ```
 *
 * @template TDto    - Kiểu dữ liệu từ API (snake_case)
 * @template TDomain - Kiểu dữ liệu domain (camelCase)
 * @param mapping    - Object ánh xạ: key = domain field, value = dto key hoặc [dto key, transform fn]
 * @returns Hàm chuyển đổi `(dto: Partial<TDto>) => Partial<TDomain>`
 */
export function createFromDto<
	TDto extends Record<string, unknown>,
	TDomain extends Record<string, unknown>,
>(mapping: MappingConfig<TDto, TDomain>) {
	function fromDto(dto: TDto): TDomain;
	function fromDto(dto: Partial<TDto>): Partial<TDomain>;
	function fromDto(dto: TDto | Partial<TDto>): TDomain | Partial<TDomain> {
		const result: Record<string, unknown> = {};
		for (const [domainKey, mapValue] of Object.entries(mapping)) {
			const [dtoKey, transform] = Array.isArray(mapValue)
				? mapValue
				: [mapValue, undefined];
			const value = dto[dtoKey as keyof TDto];
			if (value !== undefined) {
				result[domainKey] = transform ? transform(value) : value;
			}
		}
		return result as TDomain | Partial<TDomain>;
	}
	return fromDto;
}
