const pool = require("../../helpers/DatabasePool");
const {
  AuthorizationError,
  InvariantError,
  NotFoundError,
  handleError,
} = require("../../helpers/ErrorsManager");
const {
  postRetailerSchema,
  patchRetailerSchema,
  getAdminId,
} = require("./validator");
const { imageToBlob } = require("../../helpers/ImageConverter");

const postRetailer = async (request, h) => {
  try {
    const { id: adminId } = request.auth.credentials;
    const { error = undefined } = postRetailerSchema.validate(request.payload);

    if (error) {
      throw new InvariantError(error.message);
    }

    const {
      gmaps = null,
      image,
      bannerImage,
      ...restPayload
    } = request.payload;

    const imageBlob = image ? await imageToBlob(image) : null;
    const bannerImageBlob = bannerImage ? await imageToBlob(bannerImage) : null;

    const resultPostRetailer = await _executeQuery({
      sql: "INSERT INTO retailers(admin_id, gmaps, image, banner_image, name, status, open_time, close_time, location, contact) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      values: [
        adminId,
        gmaps,
        imageBlob,
        bannerImageBlob,
        ...Object.values(restPayload),
      ],
    });

    if (resultPostRetailer.length === 0) {
      throw new InvariantError("Fail to add retailer");
    }

    const response = h.response({
      status: "success",
      message: "Retailer successfully added",
      data: {
        retailers: { ...restPayload, gmaps },
      },
    });

    response.code(201);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const patchRetailer = async (request, h) => {
  try {
    const { id: adminId } = request.auth.credentials;
    const { retailerId } = request.params;
    const adminIdFromDb = await getAdminId(retailerId);

    if (String(adminId) !== String(adminIdFromDb)) {
      throw new AuthorizationError("You are not authorized to update retailer");
    }

    const { error = undefined } = patchRetailerSchema.validate(request.payload);

    if (error) {
      throw new InvariantError(error.message);
    }

    const {
      gmaps = null,
      image,
      bannerImage,
      ...restPayload
    } = request.payload;

    const imageBlob = image ? await imageToBlob(image) : null;
    const bannerImageBlob = bannerImage ? await imageToBlob(bannerImage) : null;

    const resultPatchRetailer = await _executeQuery({
      sql: "UPDATE retailers SET gmaps = ?, image = ?, banner_image = ?, name = ?, status = ?, open_time = ?, close_time = ?, location = ?, contact = ? WHERE id = ? AND admin_id = ?",
      values: [
        gmaps,
        imageBlob,
        bannerImageBlob,
        ...Object.values(restPayload),
        retailerId,
        adminId,
      ],
    });

    if (resultPatchRetailer.length === 0) {
      throw new AuthorizationError("Fail to update retailer");
    }

    const response = h.response({
      status: "success",
      message: "Retailer successfully updated",
      data: {
        retailers: { ...restPayload, gmaps },
      },
    });

    response.code(200);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const getSingleRetailer = async (request, h) => {
  try {
    const { retailerId } = request.params;

    const resultGetSingleRetailer = await _executeQuery({
      sql: "SELECT * FROM retailers WHERE id = ?",
      values: [retailerId],
    });

    if (resultGetSingleRetailer.length === 0) {
      throw new InvariantError("Retailer not found");
    }

    const response = h.response({
      status: "success",
      message: "Retailer successfully retrieved",
      data: {
        retailers: resultGetSingleRetailer[0],
      },
    });

    response.code(200);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const getAllRetailers = async (request, h) => {
  try {
    const resultGetAllRetailers = await _executeQuery({
      sql: "SELECT id, name, status, open_time, close_time, location, gmaps, contact FROM retailers",
    });

    if (resultGetAllRetailers.length === 0) {
      throw new InvariantError("No retailer found");
    }

    const response = h.response({
      status: "success",
      message: "Retailers successfully retrieved",
      data: {
        retailers: resultGetAllRetailers,
      },
    });

    response.code(200);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const getAllRetailersImage = async (request, h) => {
  try {
    const resultGetAllRetailersImage = await _executeQuery({
      sql: "SELECT id, name, status, image, banner_image FROM retailers",
    });

    if (resultGetAllRetailersImage.length === 0) {
      throw new InvariantError("No retailer found");
    }

    const response = h.response({
      status: "success",
      message: "Retailers successfully retrieved",
      data: {
        retailers: resultGetAllRetailersImage,
      },
    });

    response.code(200);
    return response;
  } catch (error) {
    return handleError(error, h);
  }
};

const deleteRetailer = async (request, h) => {
  try {
    const { id: adminId } = request.auth.credentials;
    const { retailerId } = request.params;
    const adminIdFromDb = await getAdminId(retailerId);

    if (String(adminId) !== String(adminIdFromDb)) {
      throw new AuthorizationError("You are not authorized to update retailer");
    }

    const resultDeleteRetailer = await _executeQuery({
      sql: "DELETE FROM retailers WHERE id = ? AND admin_id = ?",
      values: [retailerId, adminId],
    });

    if (resultDeleteRetailer.affectedRows < 0) {
      throw new NotFoundError("No retailer found");
    }

    const response = h.response({
      status: "success",
      message: "Retailer successfully deleted",
      data: {
        retailers: { id: retailerId },
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
  postRetailer,
  patchRetailer,
  getSingleRetailer,
  getAllRetailers,
  getAllRetailersImage,
  deleteRetailer,
};
