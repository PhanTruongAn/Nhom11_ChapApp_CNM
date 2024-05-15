class HandleError extends Error {
        message;
        statusCode;
        status;
        constructor(message, statusCode) {
            super(message);
            this.message = message;
            this.statusCode = statusCode;
            this.status = `${statusCode}`.startsWith("4") ? "false" : "success";
            Error.captureStackTrace(this, this.constructor);
        }
    }
    
    export default HandleError;
  