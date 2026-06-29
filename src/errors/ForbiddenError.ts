import AppError from "./AppError";

export default class ForbiddenError extends AppError {
	constructor(
		message: string = "Bạn không có quyền truy cập",
		code: string = "PERMISSION_DENIED",
	) {
		super(message, 403, code);
		this.name = "ForbiddenError";
	}
}
