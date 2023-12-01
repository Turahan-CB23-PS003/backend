/* Global __dirname */

const fs = require("fs");
const path = require("path");
const { Buffer } = require("buffer");
const pool = require("./DatabasePool");
const { InvariantError } = require("./ErrorsManager");

const imageToBlob = (image) => {
  const tempFilePath = `./temp-image-${Date.now()}.jpg`;
  const writableStream = fs.createWriteStream(tempFilePath);

  return new Promise((resolve, reject) => {
    image.pipe(writableStream);

    image.on("end", () => {
      const imageBuffer = fs.readFileSync(tempFilePath);
      const imageBase64 = imageBuffer.toString("base64");
      const imageBlob = Buffer.from(imageBase64, "base64");
      fs.unlinkSync(tempFilePath);
      resolve(imageBlob);
    });

    image.on("error", (error) => {
      reject(error);
    });
  });
};

const blobToImage = (blob, filePath) => {
  fs.writeFileSync(filePath, blob);
};

const uploadImage = async ({ adminId, image, table }) => {
  const uploadPath = path.join(__dirname, `../assets/img/${table}`);
  const fileName = `${adminId}_${Date.now()}_${image.hapi.filename}`;
  const filePath = path.join(uploadPath, fileName);
  const fileStream = fs.createWriteStream(filePath);

  const uploadFile = async () => {
    try {
      await new Promise((resolve, reject) => {
        image.on("error", (err) => {
          reject(err);
        });

        image.pipe(fileStream);

        image.on("end", () => {
          const response = {
            message: "File uploaded successfully",
            filename: fileName,
          };
          resolve(response);
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  uploadFile();

  return fileName;
};

const deleteImage = async (id, table) => {
  const resultGetImageName = await _executeQuery({
    sql: `SELECT image FROM ${table} WHERE id = ?`,
    values: [id],
  });

  if (resultGetImageName.length === 0) {
    throw new InvariantError("Fail to add meal");
  }

  if (resultGetImageName[0].image !== null) {
    const filePath = path.join(
      __dirname,
      `../assets/img/${table}/${resultGetImageName[0].image}`,
    );

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });
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

module.exports = { imageToBlob, blobToImage, uploadImage, deleteImage };
