import NetworkError from "./network-error"

export default class TimeoutError extends NetworkError {
  constructor(message: string = "Kết nối quá hạn (Timeout)") {
    super(message)
    this.status = 504
    this.code = "TIMEOUT_ERROR"
    this.name = "TimeoutError"
  }
}
