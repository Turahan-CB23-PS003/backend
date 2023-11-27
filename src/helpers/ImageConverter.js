const fs = require("fs");
const { Buffer } = require("buffer");

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

module.exports = { imageToBlob, blobToImage };
