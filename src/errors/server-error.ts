import AppError from "./app-error"

export default class ServerError extends AppError {
  constructor(
    message: string = "Máy chủ gặp sự cố nội bộ",
    status: number = 500,
    code: string = "SERVER_ERROR",
  ) {
    super(message, status, code)
    this.name = "ServerError"
  }
}
