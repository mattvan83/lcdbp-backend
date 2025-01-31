const cloudinary = require("cloudinary").v2;

const deleteFromCloudinary = async (cloudinaryUrl) => {
  try {
    // Split URL by '/upload/'
    const parts = cloudinaryUrl.split("/upload/");
    if (parts.length < 2) {
      return null;
    }

    // Get everything after '/upload/' and remove version number if exists
    const path = parts[1].split("/").slice(1).join("/");

    // Remove file extension
    const fullPublicId = path.substring(0, path.lastIndexOf("."));

    // Delete the resource
    const result = await cloudinary.uploader.destroy(fullPublicId);

    if (result.result === "ok") {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(`Failed to delete from Cloudinary: ${error.message}`);
  }
};

module.exports = { deleteFromCloudinary };
