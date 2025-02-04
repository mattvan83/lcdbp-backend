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
  if (!req.files || !req.files.mediasFromFront) {
    res.json({ result: false, error: "No files were uploaded" });
    return;
  }

  if (!checkBody(req.body, ["token", "mediaDate", "title", "mediaCategory"])) {
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

  try {
    const { mediasFromFront } = req.files;
    const files = Array.isArray(mediasFromFront)
      ? mediasFromFront
      : [mediasFromFront];

    // Get capture times and prepare for sorting
    const filesWithDates = await Promise.all(
      files.map(async (file) => ({
        file,
        captureTime: (await getCaptureTime(file)) || new Date(0),
      }))
    );

    // Sort by capture time, then by filename
    const sortedFiles = filesWithDates.sort((a, b) => {
      const timeCompare = a.captureTime.getTime() - b.captureTime.getTime();
      if (timeCompare !== 0) {
        return timeCompare;
      }
      return a.file.name.localeCompare(b.file.name);
    });

    res.json({ result: true, sortedFiles: sortedFiles });
  } catch (error) {
    res.json({
      result: false,
      error: "Upload failed: " + error.message,
    });
  }

  // const tmpDir = "./tmp";
  // if (!fs.existsSync(tmpDir)) {
  //   fs.mkdirSync(tmpDir);
  // }

  // const mediaPaths = [];
  // let sortedMediaPaths = [];

  // try {
  //   if (!Array.isArray(mediasFromFront) && mediasFromFront) {
  //     const mediaPath = `${tmpDir}/${uniqid()}${mediasFromFront.name.substring(
  //       mediasFromFront.name.lastIndexOf(".")
  //     )}`;
  //     await mediasFromFront.mv(mediaPath);
  //     mediaPaths.push({
  //       path: mediaPath,
  //       mimetype: mediasFromFront.mimetype,
  //     });
  //   } else if (Array.isArray(mediasFromFront) && mediasFromFront.length) {
  //     const mediaPathsWithDates = [];
  //     for (const media of mediasFromFront) {
  //       const captureTime = (await getCaptureTime(media.name)) || new Date(0);
  //       mediaPathsWithDates.push({
  //         captureTime: captureTime,
  //         originalName: media.name,
  //         content: media, // Preserve original name
  //       });
  //     }

  //     console.log("mediaPathsWithDates: ", mediaPathsWithDates);

  //     // Sort by capture time, then by original filename
  //     sortedMediaPaths = mediaPathsWithDates.sort((a, b) => {
  //       const timeA = a.captureTime?.getTime() || 0;
  //       const timeB = b.captureTime?.getTime() || 0;
  //       const timeCompare = timeA - timeB;

  //       if (timeCompare !== 0) {
  //         return timeCompare;
  //       }
  //       return a.originalName.localeCompare(b.originalName);
  //     });

  //     // if (!Array.isArray(mediasFromFront) && mediasFromFront) {
  //     //   const mediaPath = `${tmpDir}/${uniqid()}_${mediasFromFront.name}`;
  //     //   await mediasFromFront.mv(mediaPath);
  //     //   mediaPaths.push({
  //     //     path: mediaPath,
  //     //     mimetype: mediasFromFront.mimetype,
  //     //   });
  //     // } else if (Array.isArray(mediasFromFront) && mediasFromFront.length) {
  //     //   for (const mediaFromFront of mediasFromFront) {
  //     //     const mediaPath = `${tmpDir}/${uniqid()}_${mediaFromFront.name}`;
  //     //     await mediaFromFront.mv(mediaPath);
  //     //     mediaPaths.push({
  //     //       path: mediaPath,
  //     //       mimetype: mediaFromFront.mimetype,
  //     //     });
  //     //   }
  //     // }

  //     res.json({ result: true, sortedMedia: sortedMediaPaths });
  //   }
  // } catch (err) {
  //   res.json({ result: false, error: "Error moving files: " + err.message });
  //   return;
  // }

  const mediaResults = [];

  // try {
  //   if (mediaPaths.length) {
  //     // // Add capture time to each media path
  //     // const mediaPathsWithDates = [];
  //     // for (const media of mediaPaths) {
  //     //   const captureTime = (await getCaptureTime(media.path)) || new Date(0);
  //     //   console.log("Original file name:", media.path);
  //     //   console.log("Capture time:", captureTime);

  //     //   mediaPathsWithDates.push({
  //     //     ...media,
  //     //     captureTime: captureTime,
  //     //     originalName: mediasFromFront.name, // Preserve original name
  //     //     filename: media.path.split("/").pop(),
  //     //   });
  //     // }

  //     // // Sort by capture time, then by original filename
  //     // sortedMediaPaths = mediaPathsWithDates.sort((a, b) => {
  //     //   const timeA = a.captureTime?.getTime() || 0;
  //     //   const timeB = b.captureTime?.getTime() || 0;
  //     //   const timeCompare = timeA - timeB;

  //     //   if (timeCompare !== 0) {
  //     //     return timeCompare;
  //     //   }
  //     //   return a.originalName.localeCompare(b.originalName);
  //     // });

  //     console.log("Uploading files in order:");
  //     for (const {
  //       path: mediaPath,
  //       mimetype,
  //       originalName,
  //     } of sortedMediaPaths) {
  //       console.log("Uploading:", originalName);
  //       const { type, folder } = getFileTypeFromMime(mimetype);
  //       const mediaResult = await cloudinary.uploader.upload(mediaPath, {
  //         resource_type: type,
  //         folder: folder,
  //         use_filename: true,
  //         public_id: originalName.split(".")[0], // Use original name without extension
  //       });
  //       mediaResults.push(mediaResult);
  //       console.log("Upload result URL:", mediaResult.secure_url);
  //     }

  //     // sortedMediaPaths.forEach(({ path }) => {
  //     //   if (fs.existsSync(path)) {
  //     //     fs.unlinkSync(path);
  //     //   }
  //     // });
  //   }

  //   // Save to database using async/await
  //   try {
  //     const { mediaDate, title, mediaCategory } = req.body;

  //     const mediaFields = {
  //       mediaDate,
  //       title,
  //       mediaCategory,
  //       mediaUrl: mediaResults.map((media) => media.secure_url),
  //     };

  //     const newMedia = new Media(mediaFields);
  //     const newMediaDB = await newMedia.save();

  //     res.json({ result: true, newMedia: newMediaDB });
  //   } catch (dbError) {
  //     throw new Error(`Database error: ${dbError.message}`);
  //   }
  // } catch (err) {
  //   // Clean up files on error using sortedMediaPaths if available
  //   const pathsToClean = sortedMediaPaths.length
  //     ? sortedMediaPaths
  //     : mediaPaths;
  //   pathsToClean.forEach(({ path }) => {
  //     if (fs.existsSync(path)) {
  //       fs.unlinkSync(path);
  //     }
  //   });

  //   res.json({
  //     result: false,
  //     error: "Error uploading to Cloudinary: " + err.message,
  //     details: err.stack,
  //   });
  // }
});

module.exports = router;
