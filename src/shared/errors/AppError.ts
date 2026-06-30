export default class AppError extends Error {
	public status: number;
	public code: string;

	constructor(
		message: string,
		status: number = 500,
		code: string = "APP_ERROR",
	) {
		super(message);
		this.name = "AppError";
		this.status = status;
		this.code = code;
	}
}
