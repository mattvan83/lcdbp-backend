var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const User = require("../models/users");
const Media = require("../models/medias");
const { checkBody } = require("../modules/checkBody");
const { deleteFromCloudinary } = require("../modules/cloudinary");

function getFileTypeFromMime(mimeType) {
  if (mimeType.startsWith("image/")) {
    return { type: "image", folder: "lcdbp/medias/images" };
  } else if (mimeType.startsWith("audio/")) {
    return { type: "video", folder: "lcdbp/medias/audio" }; // Cloudinary uses 'video' for audio
  } else if (mimeType.startsWith("video/")) {
    return { type: "video", folder: "lcdbp/medias/videos" };
  }
  throw new Error(`Unsupported file type: ${mimeType}`);
}

// Upload media data to Db and Cloudinary under admin rights
router.post("/upload", async (req, res) => {
  try {
    if (!req.files || !req.files.mediasFromFront) {
      res.json({ result: false, error: "No files were uploaded" });
      return;
    }

    if (
      !checkBody(req.body, ["token", "mediaDate", "title", "mediaCategory"])
    ) {
      res.json({ result: false, error: "Missing or empty fields" });
      return;
    }

    const userFound = await User.findOne({
      token: req.body.token,
      type: "admin",
    });

    if (!userFound) {
      res.json({
        result: false,
        error: "Administrateur non identifié en base de données",
      });
      return;
    }

    const { mediasFromFront } = req.files;
    const mediaFiles = Array.isArray(mediasFromFront)
      ? mediasFromFront
      : [mediasFromFront];

    const tmpDir = "./tmp";
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    const mediaPaths = [];
    const mediaResults = [];

    if (mediaFiles.length) {
      for (const mediaFile of mediaFiles) {
        const mediaFilePath = `${tmpDir}/${uniqid()}${mediaFile.name.substring(
          mediaFile.name.lastIndexOf(".")
        )}`;
        await mediaFile.mv(mediaFilePath);
        mediaPaths.push({
          path: mediaFilePath,
          mimetype: mediaFile.mimetype,
        });
      }
    }

    if (mediaPaths.length) {
      for (const { path: mediaPath, mimetype } of mediaPaths) {
        const { type, folder } = getFileTypeFromMime(mimetype);
        const mediaResult = await cloudinary.uploader.upload(mediaPath, {
          resource_type: type,
          folder: folder,
          use_filename: true,
        });
        mediaResults.push(mediaResult);
      }
    }

    const { mediaDate, title, mediaCategory } = req.body;

    const mediaFields = {
      mediaDate,
      title,
      mediaCategory,
      mediaUrls: mediaResults.map((mediaResult) => mediaResult.secure_url),
    };

    const newMedia = new Media(mediaFields);
    const newMediaDB = await newMedia.save();

    mediaPaths.forEach(({ path }) => {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    });

    res.json({ result: true, newMedia: newMediaDB });
  } catch (error) {
    if (mediaPaths.length) {
      mediaPaths.forEach(({ path }) => {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      });
    }

    // Cleanup Cloudinary uploads if database save failed
    if (mediaResults.length && error.message.includes("Database error")) {
      for (const mediaResult of mediaResults) {
        await deleteFromCloudinary(mediaResult.secure_url);
      }
    }

    res.json({
      result: false,
      error: error.message,
      details: error.stack,
    });
  }
});

module.exports = router;
