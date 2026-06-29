import AppError from "./AppError";

export default class NetworkError extends AppError {
	constructor(message: string = "Không thể kết nối đến máy chủ") {
		super(message, 503, "NETWORK_ERROR");
		this.name = "NetworkError";
	}
}
