class ApiError {
  constructor(obj) {
    const { code, message } = obj;

    this.code = code;
    this.message = message;
  }

  static SendToErrorMiddleware() {
    // const { code, message } = obj;
    // throw new ApiError(code, message);
  }
}

module.exports = ApiError;
