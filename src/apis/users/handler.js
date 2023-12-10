const pool = require("../../helpers/DatabasePool");
const crypto = require("crypto");
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
  patchPasswodSchema,
} = require("./validator");
const { uploadImage, deleteImage } = require("../../helpers/ImageConverter");
const { generateAccessToken } = require("../../helpers/TokenManager");

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return { salt, hash };
};

const verifyPassword = (password, salt, hash) => {
  const hashToVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashToVerify;
};

const postRegister = async (request, h) => {
  try {
    const { error = undefined } = postRegisterSchema.validate(request.payload);

    if (error) {
      throw new InvariantError(error.message);
    }

    const { email, password, name, image } = request.payload;
    await verifyNewEmail(email);
    const { salt, hash } = hashPassword(password);

    const fileName = image
      ? await uploadImage({
          adminId: "u",
          image,
          table: "users",
        })
      : null;

    const retsultPostRegister = await _executeQuery({
      sql: "INSERT INTO users(email, password, salt, name, image) VALUES(?, ?, ?, ?, ?)",
      values: [email, hash, salt, name, fileName],
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
          image: fileName,
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

    const verified = verifyPassword(
      password,
      resultPostLogin[0].salt,
      resultPostLogin[0].password,
    );

    if (!verified) {
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

    const resultValidateUser = await _executeQuery({
      sql: "SELECT * FROM users WHERE id = ?",
      values: [userId],
    });

    if (resultValidateUser.length === 0) {
      throw new InvariantError("Id not found");
    }

    let fileName = resultValidateUser[0].image;

    const { name, image = undefined } = request.payload;

    if (image) {
      await deleteImage(credentialId, "users");
      fileName = await uploadImage({
        adminId: "u",
        image,
        table: "users",
      });
    }

    const resultPatchUser = await _executeQuery({
      sql: "UPDATE users SET name = ?, image = ? WHERE id = ?",
      values: [name, fileName, userId],
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
          image: fileName,
        },
      },
    });
    response.code(200);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const patchPasswod = async (request, h) => {
  try {
    const { userId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    if (String(userId) !== String(credentialId)) {
      throw new AuthorizationError(
        "User is not authorized to access this resource",
      );
    }

    const { error = undefined } = patchPasswodSchema.validate(request.payload);

    if (error) {
      throw new InvariantError(error.message);
    }

    const resultValidateUser = await _executeQuery({
      sql: "SELECT * FROM users WHERE id = ?",
      values: [userId],
    });

    if (resultValidateUser.length === 0) {
      throw new InvariantError("Id not found");
    }

    const { oldPassword, newPassword } = request.payload;

    const verified = verifyPassword(
      oldPassword,
      resultValidateUser[0].salt,
      resultValidateUser[0].password,
    );

    if (!verified) {
      throw new AuthenticationError("Wrong password");
    }

    const { salt, hash } = hashPassword(newPassword);

    const resultPatchPasswod = await _executeQuery({
      sql: "UPDATE users SET password = ?, salt = ? WHERE id = ?",
      values: [hash, salt, userId],
    });

    if (resultPatchPasswod.length === 0) {
      throw new InvariantError("Fail to change password");
    }

    const response = h.response({
      status: "success",
      message: "Password successfully changed",
      data: {
        users: {
          id: userId,
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

module.exports = {
  postRegister,
  postLogin,
  getUser,
  patchUser,
  patchPasswod,
};
