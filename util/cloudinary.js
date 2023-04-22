const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function cloudUpload(filePath) {
  return cloudinary.uploader.upload(filePath, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      return { url: result.url };
    }
  });
}
module.exports = cloudinary;
module.exports = cloudUpload;
