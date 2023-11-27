class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ClientError";
  }
}

class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 401);
    this.name = "AuthenticationError";
  }
}

class AuthorizationError extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = "AuthorizationError";
  }
}

class InvariantError extends ClientError {
  constructor(message) {
    super(message);
    this.name = "InvariantError";
  }
}

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

class ServerError extends ClientError {
  constructor(message) {
    super(message, 500);
    this.name = "ServerError";
  }
}

function handleError(error, h) {
  if (error instanceof ClientError) {
    return h.response({
      status: "fail",
      message: error.message,
      code: error.statusCode,
    });
  } else {
    return h.response({
      status: "fail",
      message: error.message,
      code: 500,
    });
  }
}

module.exports = {
  ClientError,
  AuthenticationError,
  AuthorizationError,
  InvariantError,
  NotFoundError,
  ServerError,
  handleError,
};
