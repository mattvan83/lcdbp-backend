var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const User = require("../models/users");
const Listening = require("../models/listenings");
const { checkBody } = require("../modules/checkBody");
const { deleteFromCloudinary } = require("../modules/cloudinary");

// Upload listening data to Db and Cloudinary under admin rights
router.post("/upload", async (req, res) => {
  if (
    !checkBody(req.body, [
      "token",
      "title",
      "authorMusic",
      "thumbnailDescription",
      "recordingDate",
      "lastListening",
    ]) ||
    !checkBody(req.files, ["listeningFromFront", "thumbnailFromFront"])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const userFound = await User.findOne({
    token: req.body.token,
    type: "admin",
  });

  if (userFound) {
    const { listeningFromFront, thumbnailFromFront } = req.files;

    const tmpDir = "./tmp";
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    const listeningPath = `${tmpDir}/${uniqid()}.mp3`;
    const thumbnailPath = `${tmpDir}/${uniqid()}.jpg`;

    try {
      await listeningFromFront.mv(listeningPath);
      await thumbnailFromFront.mv(thumbnailPath);
    } catch (err) {
      res.json({ result: false, error: "Error moving files: " + err.message });
      return;
    }

    try {
      const uploadAudio = cloudinary.uploader.upload(listeningPath, {
        resource_type: "video",
        folder: "lcdbp/listenings/audio",
        use_filename: true,
      });
      const uploadImage = cloudinary.uploader.upload(thumbnailPath, {
        resource_type: "image",
        folder: "lcdbp/listenings/images",
        use_filename: true,
      });

      const [audioResult, imageResult] = await Promise.all([
        uploadAudio,
        uploadImage,
      ]);

      // console.log("audioResult: ", audioResult);
      // console.log("imageResult: ", imageResult);

      fs.unlinkSync(listeningPath);
      fs.unlinkSync(thumbnailPath);

      const {
        title,
        artwork,
        authorText,
        authorMusic,
        arrangement,
        harmonization,
        thumbnailDescription,
        recordingDate,
        lastListening,
      } = req.body;

      const listeningFields = {
        title,
        audioUrl: audioResult.secure_url,
        authorMusic,
        thumbnailUrl: imageResult.secure_url,
        thumbnailDescription,
        recordingDate,
        lastListening,
      };

      if (artwork) {
        listeningFields.artwork = artwork;
      }

      if (authorText) {
        listeningFields.authorText = authorText;
      }

      if (arrangement) {
        listeningFields.arrangement = arrangement;
      }

      if (harmonization) {
        listeningFields.harmonization = harmonization;
      }

      const newListening = new Listening(listeningFields);

      newListening.save().then((newListeningDB) => {
        res.json({ result: true, newListening: newListeningDB });
      });
    } catch (err) {
      fs.unlinkSync(listeningPath);
      fs.unlinkSync(thumbnailPath);
      res.json({
        result: false,
        error: "Error uploading to Cloudinary: " + err.message,
      });
    }
  } else {
    res.json({
      result: false,
      error: "Administrateur non identifié en base de données",
    });
  }
});

// router.post("/uploadListening", async (req, res) => {
//   if (
//     !checkBody(req.body, ["token"]) ||
//     !checkBody(req.files, ["listeningFromFront"])
//   ) {
//     res.json({ result: false, error: "Missing or empty fields" });
//     return;
//   }

//   const userFound = await User.findOne({
//     token: req.body.token,
//     type: "admin",
//   });

//   if (userFound) {
//     const { listeningFromFront } = req.files;

//     try {
//       const uniqueFilename = uniqid();
//       const audioResult = await cloudinary.uploader.upload(
//         listeningFromFront.tempFilePath,
//         {
//           resource_type: "video",
//           folder: "lcdbp/listenings/audio",
//           public_id: uniqueFilename,
//           use_filename: false,
//           // timeout: 120000,
//           // chunk_size: 6000000,
//           // eager_async: true,
//         }
//       );

//       res.json({ result: true, audioUrl: audioResult.secure_url });
//     } catch (err) {
//       console.error("Cloudinary upload error:", err);
//       res.json({
//         result: false,
//         error: "Error uploading to Cloudinary: " + (err.message || err),
//       });
//     }
//   } else {
//     res.json({
//       result: false,
//       error: "Administrateur non identifié en base de données",
//     });
//   }
// });

router.post("/uploadListening", async (req, res) => {
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const userFound = await User.findOne({
    token: req.body.token,
    type: "admin",
  });

  if (userFound) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const uniqueFilename = uniqid();

      // Create params object with all required fields
      const paramsToSign = {
        eager_async: true,
        folder: "lcdbp/listenings/audio",
        public_id: uniqueFilename,
        timestamp: timestamp,
      };

      // Generate the signature
      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        process.env.CLOUDINARY_API_SECRET
      );

      res.json({
        result: true,
        uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
        params: {
          api_key: process.env.CLOUDINARY_API_KEY,
          folder: paramsToSign.folder,
          public_id: paramsToSign.public_id,
          resource_type: "video",
          timestamp: paramsToSign.timestamp,
          signature: signature,
          timeout: 120000,
          chunk_size: 6000000,
          eager_async: paramsToSign.eager_async,
        },
      });
    } catch (err) {
      console.error("Signature generation error:", err);
      res.json({
        result: false,
        error: "Error generating upload signature: " + (err.message || err),
      });
    }
  } else {
    res.json({
      result: false,
      error: "Administrateur non identifié en base de données",
    });
  }
});

router.post("/uploadListeningComplete", async (req, res) => {
  if (!checkBody(req.body, ["token", "audioUrl"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const userFound = await User.findOne({
    token: req.body.token,
    type: "admin",
  });

  if (userFound) {
    res.json({ result: true, audioUrl: req.body.audioUrl });
  } else {
    res.json({
      result: false,
      error: "Administrateur non identifié en base de données",
    });
  }
});

router.post("/uploadThumbnail", async (req, res) => {
  if (
    !checkBody(req.body, ["token"]) ||
    !checkBody(req.files, ["thumbnailFromFront"])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const userFound = await User.findOne({
    token: req.body.token,
    type: "admin",
  });

  if (userFound) {
    const { thumbnailFromFront } = req.files;

    try {
      const uniqueFilename = uniqid();
      const imageResult = await cloudinary.uploader.upload(
        thumbnailFromFront.tempFilePath,
        {
          resource_type: "image",
          folder: "lcdbp/listenings/images",
          public_id: uniqueFilename,
          use_filename: false,
          timeout: 120000,
          chunk_size: 6000000,
          eager_async: true,
        }
      );

      res.json({ result: true, thumbnailUrl: imageResult.secure_url });
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      res.json({
        result: false,
        error: "Error uploading to Cloudinary: " + (err.message || err),
      });
    }
  } else {
    res.json({
      result: false,
      error: "Administrateur non identifié en base de données",
    });
  }
});

// Get all listenings information
router.get("/", (req, res) => {
  Listening.find().then((listenings) => {
    if (listenings.length) {
      const sortedListenings = listenings.sort((a, b) => {
        // Sort by recording date first
        const dateComparison =
          new Date(b.recordingDate) - new Date(a.recordingDate);
        if (dateComparison !== 0) {
          return dateComparison;
        }
        // If recording dates are equal, sort by title
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      });

      res.json({
        result: true,
        listenings: sortedListenings,
      });
    } else {
      res.json({ result: false, error: "Listenings not found" });
    }
  });
});

// Delete all listenings documents specified by ids and all cloudinary files associated
router.post("/deleteAll", async (req, res) => {
  if (!checkBody(req.body, ["token", "ids"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  try {
    const userFound = await User.findOne({
      token: req.body.token,
      type: "admin",
    });

    if (!userFound) {
      return res.json({
        result: false,
        error: "Administrateur non identifié en base de données",
      });
    }

    // Parse ids if it's a string
    const ids = Array.isArray(req.body.ids)
      ? req.body.ids
      : JSON.parse(req.body.ids);

    // Process each id sequentially
    for (const id of ids) {
      const selectedListening = await Listening.findOne({ _id: id });

      if (!selectedListening) {
        return res.json({ result: false, error: `Listening ${id} not found` });
      }

      // Delete from Cloudinary first
      if (selectedListening.thumbnailUrl) {
        await deleteFromCloudinary(selectedListening.thumbnailUrl);
      }
      if (selectedListening.audioUrl) {
        await deleteFromCloudinary(selectedListening.audioUrl);
      }

      // Then delete from MongoDB
      await Listening.deleteOne({ _id: id });
    }

    res.json({
      result: true,
      message: "All selected listenings were successfully deleted",
    });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
