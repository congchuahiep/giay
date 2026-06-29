import AppError from "./AppError";

export default class AuthError extends AppError {
	constructor(
		message: string = "Xác thực thất bại",
		code: string = "AUTH_ERROR",
	) {
		super(message, 401, code);
		this.name = "AuthError";
	}
}
