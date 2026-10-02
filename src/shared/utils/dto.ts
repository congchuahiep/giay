/** biome-ignore-all lint/suspicious/noExplicitAny: Kệ */

/**
 * Override cho 1 field của DTO:
 *
 * - `string`: **rename** — lấy field nguồn khác tên (`title: "name"`)
 * - `[dtoKey, transform]`: **transform giá trị** (`createdAt: ["createdAt", (v) => new Date(v)]`),
 *   có thể kèm rename (`createdAt: ["created_at", (v) => new Date(v)]`)
 *
 * Field **không** được đề cập → copy nguyên trạng cùng tên (không cần ghi lại).
 */
export type DtoOverride<TDto> =
	| Extract<keyof TDto, string>
	| readonly [Extract<keyof TDto, string>, (value: any) => unknown];

/**
 * Tạo mapper từ DTO (codegen, camelCase) sang Domain — chỉ khai báo những field
 * CẦN xử lý khác thường (rename/transform). Field còn lại copy tự động.
 *
 * Muốn domain chỉ giữ một subset field, dùng `Pick` ở tầng type (không tốn runtime):
 *
 * ```ts
 * type InvitationDTO = components["schemas"]["InvitationResponse"];
 * type Invitation = Pick<InvitationDTO, "id" | "email"> & {
 *   createdAt: Date | null;
 * };
 *
 * export const invitationFromDto = createFromDto<InvitationDTO, Invitation>({
 *   // field unchanged → không ghi
 *   createdAt: ["createdAt", (v) => new Date(v)],
 * });
 * ```
 *
 * Partial vẫn được giữ: `Partial<TDto>` → `Partial<TDomain>`.
 */
export function createFromDto<
	TDto extends Record<string, unknown>,
	TDomain extends Record<string, unknown>,
>(
	overrides: Partial<{
		[K in keyof TDomain & string]: DtoOverride<TDto>;
	}>,
) {
	function fromDto(dto: TDto): TDomain;
	function fromDto(dto: Partial<TDto>): Partial<TDomain>;
	function fromDto(dto: TDto | Partial<TDto>): TDomain | Partial<TDomain> {
		// Copy mọi field cùng tên — điểm khác biệt duy nhất với DTO là các override.
		const result: Record<string, unknown> = { ...dto };

		for (const [domainKey, override] of Object.entries(overrides)) {
			const [dtoKey, transform] = Array.isArray(override)
				? override
				: [override, undefined];
			const value = (dto as Record<string, unknown>)[dtoKey];

			if (value !== undefined) {
				result[domainKey] = transform ? transform(value) : value;
				if (domainKey !== dtoKey) delete result[dtoKey]; // rename: bỏ key nguồn
			} else {
				delete result[domainKey]; // giữ partial semantics khi field không có
			}
		}

		return result as TDomain | Partial<TDomain>;
	}
	return fromDto;
}
