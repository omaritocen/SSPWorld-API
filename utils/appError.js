class AppError extends Error {
    constructor(message, statusCode)
    {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode.toString().startsWith('4') ? 'error' : 'fail';
        this.isOpertaional = true;

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError;