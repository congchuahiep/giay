import AppError from "./app-error"

export default class NotFoundError extends AppError {
  constructor(
    message: string = "Tài nguyên không tồn tại",
    code: string = "NOT_FOUND",
  ) {
    super(message, 404, code)
    this.name = "NotFoundError"
  }
}
