const pool = require("../../helpers/DatabasePool");
const bcrypt = require("bcrypt");
const {
  AuthenticationError,
  AuthorizationError,
  InvariantError,
  handleError,
} = require("../../helpers/ErrorsManager");
const {
  verifyNewEmail,
  postRegisterSchema,
  postLoginSchema,
  patchUserSchema,
} = require("./validator");
const { imageToBlob } = require("../../helpers/ImageConverter");
const { generateAccessToken } = require("../../helpers/TokenManager");

const postRegister = async (request, h) => {
  try {
    const { error = undefined } = postRegisterSchema.validate(request.payload);

    if (error) {
      throw new InvariantError(error.message);
    }

    const { email, password, name, image } = request.payload;
    await verifyNewEmail(email);
    const imageBlob = image ? await imageToBlob(image) : null;
    const hashedPassword = await bcrypt.hash(password, 10);

    const retsultPostRegister = await _executeQuery({
      sql: "INSERT INTO users(email, password, name, image) VALUES(?, ?, ?, ?)",
      values: [email, hashedPassword, name, imageBlob],
    });

    if (retsultPostRegister.length === 0) {
      throw new InvariantError("Fail to register user");
    }

    const response = h.response({
      status: "success",
      message: "User successfully registered",
      data: {
        user: {
          id: retsultPostRegister.insertId,
          email,
          name,
        },
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const postLogin = async (request, h) => {
  try {
    const { error = undefined } = postLoginSchema.validate(request.payload);

    if (error) {
      throw new InvariantError(error.message);
    }

    const { email, password } = request.payload;

    const resultPostLogin = await _executeQuery({
      sql: "SELECT * FROM users WHERE email = ?",
      values: [email],
    });

    if (resultPostLogin.length === 0) {
      throw new InvariantError("Email is not registered");
    }

    const verifyPassword = await bcrypt.compare(
      password,
      resultPostLogin[0].password,
    );

    if (!verifyPassword) {
      throw new AuthenticationError("Wrong password");
    }

    const accessToken = generateAccessToken({
      id: resultPostLogin[0].id,
    });

    const response = h.response({
      status: "success",
      message: "User successfully logged in",
      data: {
        users: {
          id: resultPostLogin[0].id,
          email,
          accessToken,
        },
      },
    });

    response.code(200);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const getUser = async (request, h) => {
  try {
    const { userId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    if (String(userId) !== String(credentialId)) {
      throw new AuthorizationError(
        "User is not authorized to access this resource",
      );
    }

    const resultGetUser = await _executeQuery({
      sql: "SELECT email, name, image FROM users WHERE id = ?",
      values: [userId],
    });

    if (resultGetUser.length === 0) {
      throw new InvariantError("User not found");
    }

    const response = h.response({
      status: "success",
      data: {
        users: resultGetUser[0],
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const patchUser = async (request, h) => {
  try {
    const { userId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    if (String(userId) !== String(credentialId)) {
      throw new AuthorizationError(
        "User is not authorized to access this resource",
      );
    }

    const { error = undefined } = patchUserSchema.validate(request.payload);

    if (error) {
      throw new InvariantError(error.message);
    }

    const { name, image } = request.payload;
    const imageBlob = image ? await imageToBlob(image) : null;

    const resultPatchUser = await _executeQuery({
      sql: "UPDATE users SET name = ?, image = ? WHERE id = ?",
      values: [name, imageBlob, userId],
    });

    if (resultPatchUser.length === 0) {
      throw new InvariantError("Fail to update user");
    }

    const response = h.response({
      status: "success",
      message: "User successfully updated",
      data: {
        users: {
          id: userId,
          name,
          image: imageBlob,
        },
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const _executeQuery = (query) => {
  return new Promise((resolve, reject) => {
    pool.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { postRegister, postLogin, getUser, patchUser };