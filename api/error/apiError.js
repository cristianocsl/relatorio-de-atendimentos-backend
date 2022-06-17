class ApiError {
  constructor(obj) {
    const { code, message } = obj;

    this.code = code;
    this.message = message;
  }
}

module.exports = ApiError;
