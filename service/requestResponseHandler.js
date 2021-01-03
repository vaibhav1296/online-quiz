const validateChecks = require("./validateChecks");
const isOnlineQuizError = require("./validateChecks").isOnlineQuizError;
const onlineQuizError = require("../config/onlineQuizError").onlineQuizError;
const handleResponse = (req, res, next) => {
  if (res.locals.response) {
    let response = {
      status: {
        code: 0,
        message: res.locals.response.message,
      },
    };
    if (res.locals.response.body) {
      response = {
        ...response,
        ...res.locals.response.body,
      };
    }
    res.locals.responseStatus = true;
    res.send(response);
  } else {
    next();
  }
};
const handleError = (err, req, res, next) => {
  let error = err;
  if (!isOnlineQuizError(error)) {
    error = onlineQuizError("Server Error");
  }
  res.status(error.statusCode || 500);
  if (
    validateChecks.isNullOrUndefined(res.locals.responseStatus) ||
    res.locals.responseStatus
  ) {
    res.send({
      status: {
        code: error.statusCode,
        message: error.message,
      },
    });
  }
};

module.exports = {
  handleResponse,
  handleError,
};
