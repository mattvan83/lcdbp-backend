var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const User = require("../models/users");
const Media = require("../models/medias");
const { checkBody } = require("../modules/checkBody");
const { deleteFromCloudinary } = require("../modules/cloudinary");
const { getCaptureTime } = require("../modules/exifExtractions");

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
  if (
    !checkBody(req.body, ["token", "mediaDate", "title", "mediaCategory"]) ||
    !checkBody(req.files, ["mediasFromFront"])
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

  if (userFound) {
    const { mediasFromFront } = req.files;

    const tmpDir = "./tmp";
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    const mediaPaths = [];

    try {
      if (!Array.isArray(mediasFromFront) && mediasFromFront) {
        const mediaPath = `${tmpDir}/${uniqid()}_${mediasFromFront.name}`;
        await mediasFromFront.mv(mediaPath);
        mediaPaths.push({
          path: mediaPath,
          mimetype: mediasFromFront.mimetype,
        });
      } else if (Array.isArray(mediasFromFront) && mediasFromFront.length) {
        for (const mediaFromFront of mediasFromFront) {
          const mediaPath = `${tmpDir}/${uniqid()}_${mediaFromFront.name}`;
          await mediaFromFront.mv(mediaPath);
          mediaPaths.push({
            path: mediaPath,
            mimetype: mediaFromFront.mimetype,
          });
        }
      }
    } catch (err) {
      res.json({ result: false, error: "Error moving files: " + err.message });
      return;
    }

    const mediaResults = [];

    try {
      if (mediaPaths.length) {
        // Add capture time to each media path
        const mediaPathsWithDates = [];
        for (const media of mediaPaths) {
          const captureTime = (await getCaptureTime(media.path)) || new Date(0); // Fallback date
          mediaPathsWithDates.push({
            ...media,
            captureTime: captureTime,
            filename: media.path.split("/").pop(),
          });
        }

        // Sort by capture time, then by filename
        const sortedMediaPaths = mediaPathsWithDates.sort((a, b) => {
          // Ensure both dates exist before comparing
          const timeA = a.captureTime?.getTime() || 0;
          const timeB = b.captureTime?.getTime() || 0;
          const timeCompare = timeA - timeB;

          if (timeCompare !== 0) {
            return timeCompare;
          }
          return a.filename.localeCompare(b.filename);
        });

        for (const { path: mediaPath, mimetype } of sortedMediaPaths) {
          const { type, folder } = getFileTypeFromMime(mimetype);
          const mediaResult = await cloudinary.uploader.upload(mediaPath, {
            resource_type: type,
            folder: folder,
            use_filename: true,
          });
          mediaResults.push(mediaResult);
        }
      }

      mediaPaths.forEach(({ path }) => {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      });

      // Save to database using async/await
      try {
        const { mediaDate, title, mediaCategory } = req.body;

        const mediaFields = {
          mediaDate,
          title,
          mediaCategory,
          mediaUrl: mediaResults.map((media) => media.secure_url),
        };

        const newMedia = new Media(mediaFields);
        const newMediaDB = await newMedia.save();
        res.json({ result: true, newMedia: newMediaDB });
      } catch (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }
    } catch (err) {
      mediaPaths.forEach(({ path }) => {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      });

      res.json({
        result: false,
        error: "Error uploading to Cloudinary: " + err.message,
        details: err.stack,
      });
    }
  }
});

module.exports = router;
