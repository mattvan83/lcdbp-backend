var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

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
  const mediaTypes = {
    audio: { paths: [], results: [], reqKey: "audiosFromFront" },
    image: { paths: [], results: [], reqKey: "imagesFromFront" },
    video: { paths: [], results: [], reqKey: "videosFromFront" },
  };
  const tmpDir = path.join(__dirname, "../tmp");

  async function cleanupResources() {
    // Cleanup temp files
    Object.values(mediaTypes).forEach((type) => {
      type.paths.forEach(({ path }) => {
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      });
    });

    // Try to remove tmp directory if empty
    try {
      if (fs.existsSync(tmpDir) && fs.readdirSync(tmpDir).length === 0) {
        fs.rmdirSync(tmpDir);
      }
    } catch (cleanupError) {
      console.error("Failed to cleanup tmp directory:", cleanupError);
    }
  }

  async function processMediaFiles(mediaType, files) {
    if (!files?.length) {
      return;
    }

    // Save files to tmp directory
    for (const file of files) {
      const filePath = path.join(
        tmpDir,
        `${uniqid()}${path.extname(file.name)}`
      );
      await file.mv(filePath);
      mediaType.paths.push({
        path: filePath,
        mimetype: file.mimetype,
      });
    }

    console.log("mediaType.paths: ", mediaType.paths);

    // Upload to Cloudinary
    for (const { path: filePath, mimetype } of mediaType.paths) {
      const { type, folder } = getFileTypeFromMime(mimetype);

      try {
        const result = await cloudinary.uploader.upload(filePath, {
          resource_type: type,
          folder: folder,
          use_filename: true,
          timeout: 120000,
          chunk_size: 6000000,
          eager_async: true,
        });
        mediaType.results.push(result);
      } catch (uploadError) {
        console.error(`Failed to upload file ${filePath}:`, uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
    }
  }

  try {
    if (
      !req.files ||
      (!req.files.audiosFromFront &&
        !req.files.imagesFromFront &&
        !req.files.videosFromFront)
    ) {
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

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // Process each media type
    for (const [key, mediaType] of Object.entries(mediaTypes)) {
      const files = req.files[mediaType.reqKey];
      if (files) {
        await processMediaFiles(
          mediaType,
          Array.isArray(files) ? files : [files]
        );
      }
    }

    const { mediaDate, title, mediaCategory } = req.body;

    const mediaFields = {
      mediaDate,
      title,
      mediaCategory,
      audioUrls: mediaTypes.audio.results.map((result) => result.secure_url),
      imageUrls: mediaTypes.image.results.map((result) => result.secure_url),
      videoUrls: mediaTypes.video.results.map((result) => result.secure_url),
    };

    const newMedia = new Media(mediaFields);
    const newMediaDB = await newMedia.save();

    await cleanupResources();

    res.json({ result: true, newMedia: newMediaDB });
  } catch (error) {
    await cleanupResources();

    // Cleanup all Cloudinary uploads if database save failed
    if (error.message.includes("Database error")) {
      for (const type of Object.values(mediaTypes)) {
        for (const result of type.results) {
          await deleteFromCloudinary(result.secure_url);
        }
      }
    }

    res.json({
      result: false,
      error: error.message,
      details: error.stack,
    });
  }
});

// Get all medias grouped by mediaCategory (asc) then by year (desc)
router.post("/groupedMedias", async (req, res) => {
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const userFound = await User.findOne({
    token: req.body.token,
  });

  if (userFound) {
    Media.aggregate([
      {
        $addFields: {
          year: { $year: { $toDate: "$mediaDate" } },
        },
      },
      {
        $group: {
          _id: {
            category: "$mediaCategory",
            year: "$year",
          },
          medias: {
            $push: {
              _id: "$_id",
              mediaDate: "$mediaDate",
              title: "$title",
              audioUrls: "$audioUrls",
              imageUrls: "$imageUrls",
              videoUrls: "$videoUrls",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.category",
          yearsGrouped: {
            $push: {
              year: "$_id.year",
              medias: {
                $sortArray: {
                  input: "$medias",
                  sortBy: { mediaDate: -1, title: 1 },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          mediaCategory: "$_id",
          years: {
            $map: {
              input: {
                $sortArray: {
                  input: "$yearsGrouped",
                  sortBy: { year: -1 },
                },
              },
              in: { $toString: "$$this.year" },
            },
          },
          yearsGrouped: {
            $sortArray: {
              input: "$yearsGrouped",
              sortBy: { year: -1 },
            },
          },
        },
      },
      {
        $sort: { mediaCategory: 1 },
      },
    ]).then((mediasGrouped) => {
      if (mediasGrouped.length) {
        const mediaCategories = mediasGrouped.map((item) => item.mediaCategory);

        res.json({ result: true, mediaCategories, mediasGrouped });
      } else {
        res.json({ result: false, error: "Medias not found" });
      }
    });
  } else {
    res.json({
      result: false,
      error: "Membre non identifié en base de données",
    });
  }
});

module.exports = router;
