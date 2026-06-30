import AppError from "./AppError";

export default class ValidationError extends AppError {
	public fields: Record<string, string[]>;

	constructor(
		message: string = "Dữ liệu không hợp lệ",
		fields: Record<string, string[]> = {},
		code: string = "VALIDATION_ERROR",
	) {
		super(message, 400, code);
		this.name = "ValidationError";
		this.fields = fields;
	}

	getFieldErrors(fieldName: string): string[] {
		return this.fields[fieldName] ?? [];
	}

	getAllErrors(): string[] {
		return Object.values(this.fields).flat();
	}

	getErrorFields(): string[] {
		return Object.keys(this.fields);
	}

	get isFieldOnly(): boolean {
		return Object.keys(this.fields).length > 0;
	}
}
