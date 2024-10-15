var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const User = require("../models/users");
const StudiedWork = require("../models/studiedWorks");
const { checkBody } = require("../modules/checkBody");

const asyncArrayMethod = async (array) => {
  return await Promise.all(
    array.map(async (item) => {
      // Perform an asynchronous operation on each item
      return await someAsyncFunction(item);
    })
  );
};

// Upload studied work data to Db and Cloudinary under admin rights
router.post("/upload", async (req, res) => {
  if (
    !checkBody(req.body, [
      "token",
      "title",
      "code",
      "authorMusic",
      "isAtWork",
    ]) ||
    !checkBody(req.files, ["partitionFromFront"])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const userFound = await User.findOne({
    token: req.body.token,
    type: "admin",
  });

  if (userFound) {
    const barytonRecordingsPaths = [];
    const bassRecordingsPaths = [];
    const tenor1RecordingsPaths = [];
    const tenor2RecordingsPaths = [];
    const tuttiRecordingsPaths = [];

    try {
      const {
        partitionFromFront,
        barytonRecordingsFromFront,
        bassRecordingsFromFront,
        tenor1RecordingsFromFront,
        tenor2RecordingsFromFront,
        tuttiRecordingsFromFront,
      } = req.files;

      const tmpDir = "./tmp";
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir);
      }

      const partitionPath = `${tmpDir}/${uniqid()}.pdf`;
      await partitionFromFront.mv(partitionPath);

      if (
        Array.isArray(barytonRecordingsFromFront) &&
        barytonRecordingsFromFront.length
      ) {
        for (const barytonRecording of barytonRecordingsFromFront) {
          const barytonRecordingPath = `${tmpDir}/${uniqid()}.mp3`;
          await barytonRecording.mv(barytonRecordingPath);
          barytonRecordingsPaths.push(barytonRecordingPath);
        }
      }

      if (
        Array.isArray(bassRecordingsFromFront) &&
        bassRecordingsFromFront.length
      ) {
        for (const bassRecording of bassRecordingsFromFront) {
          const bassRecordingPath = `${tmpDir}/${uniqid()}.mp3`;
          await bassRecording.mv(bassRecordingPath);
          bassRecordingsPaths.push(bassRecordingPath);
        }
      }

      if (
        Array.isArray(tenor1RecordingsFromFront) &&
        tenor1RecordingsFromFront.length
      ) {
        for (const tenor1Recording of tenor1RecordingsFromFront) {
          const tenor1RecordingPath = `${tmpDir}/${uniqid()}.mp3`;
          await tenor1Recording.mv(tenor1RecordingPath);
          tenor1RecordingsPaths.push(tenor1RecordingPath);
        }
      }

      if (
        Array.isArray(tenor2RecordingsFromFront) &&
        tenor2RecordingsFromFront.length
      ) {
        for (const tenor2Recording of tenor2RecordingsFromFront) {
          const tenor2RecordingPath = `${tmpDir}/${uniqid()}.mp3`;
          await tenor2Recording.mv(tenor2RecordingPath);
          tenor2RecordingsPaths.push(tenor2RecordingPath);
        }
      }

      if (
        Array.isArray(tuttiRecordingsFromFront) &&
        tuttiRecordingsFromFront.length
      ) {
        for (const tuttiRecording of tuttiRecordingsFromFront) {
          const tuttiRecordingPath = `${tmpDir}/${uniqid()}.mp3`;
          await tuttiRecording.mv(tuttiRecordingPath);
          tuttiRecordingsPaths.push(tuttiRecordingPath);
        }
      }
    } catch (err) {
      res.json({ result: false, error: "Error moving files: " + err.message });
      return;
    }

    const barytonRecordingResults = [];
    const bassRecordingResults = [];
    const tenor1RecordingResults = [];
    const tenor2RecordingResults = [];
    const tuttiRecordingResults = [];

    try {
      const partitionResult = await cloudinary.uploader.upload(partitionPath, {
        resource_type: "raw",
        folder: "lcdbp/studiedWorks/partitions",
        use_filename: true,
      });

      if (
        Array.isArray(barytonRecordingsPaths) &&
        barytonRecordingsPaths.length
      ) {
        for (const barytonRecordingPath of barytonRecordingsPaths) {
          const barytonRecordingResult = await cloudinary.uploader.upload(
            barytonRecordingPath,
            {
              resource_type: "video",
              folder: "lcdbp/studiedWorks/audio",
              use_filename: true,
            }
          );

          barytonRecordingResults.push(barytonRecordingResult);
        }
      }

      fs.unlinkSync(partitionPath);
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

module.exports = router;
