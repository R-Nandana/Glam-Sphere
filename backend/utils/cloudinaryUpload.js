const cloudinary = require("../config/cloudinary");

// Uploads a buffer (from multer memoryStorage) to Cloudinary via upload_stream
const uploadBufferToCloudinary = (buffer, folder = "glamsphere/products") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

const deleteFromCloudinary = (publicId) => cloudinary.uploader.destroy(publicId);

module.exports = { uploadBufferToCloudinary, deleteFromCloudinary };
