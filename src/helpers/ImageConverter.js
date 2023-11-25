const fs = require("fs");
const { Buffer } = require("buffer");

function imageToBlob(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  const imageBase64 = imageBuffer.toString("base64");
  return Buffer.from(imageBase64, "base64");
}

const blobToImage = (blob) => {
  const base64Image = Buffer.from(blob, "binary").toString("base64");
  const dataURI = `data:image/jpeg;base64,${base64Image}`;
  return dataURI;
};

module.exports = { imageToBlob, blobToImage };