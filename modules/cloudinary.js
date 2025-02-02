const cloudinary = require("cloudinary").v2;

const deleteFromCloudinary = async (cloudinaryUrl) => {
  try {
    // Split URL by '/upload/'
    const parts = cloudinaryUrl.split("/upload/");
    if (parts.length < 2) {
      return null;
    }

    // Determine resource type based on URL (video for audio files)
    const isAudio = cloudinaryUrl.includes("/video/upload/");
    const isRaw = cloudinaryUrl.includes("/raw/upload/");
    // console.log("isRaw: ", isRaw);

    // Get everything after '/upload/' and remove version number if exists
    const path = parts[1].split("/").slice(1).join("/");
    // console.log("path: ", path);

    // Remove file extension only for non-raw files
    const fullPublicId = isRaw
      ? path
      : path.substring(0, path.lastIndexOf("."));
    // console.log("fullPublicId: ", fullPublicId);

    // Delete the resource
    const result = await cloudinary.uploader.destroy(fullPublicId, {
      resource_type: isRaw ? "raw" : isAudio ? "video" : "image",
    });

    // console.log("result.result: ", result.result);

    if (result.result === "ok") {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(`Failed to delete from Cloudinary: ${error.message}`);
  }
};

module.exports = { deleteFromCloudinary };
