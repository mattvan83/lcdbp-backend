var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const User = require("../models/users");
const StudiedWork = require("../models/studiedWorks");
const { checkBody, checkWorkRecording } = require("../modules/checkBody");

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
    !checkBody(req.body, ["token", "title", "code", "isAtWork"]) ||
    !checkBody(req.files, ["partitionFromFront"])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  if (
    !checkWorkRecording(
      req.files.barytonRecordingsFromFront,
      req.body.barytonRecordingDescriptions
    ) ||
    !checkWorkRecording(
      req.files.bassRecordingsFromFront,
      req.body.bassRecordingDescriptions
    ) ||
    !checkWorkRecording(
      req.files.tenor1RecordingsFromFront,
      req.body.tenor1RecordingDescriptions
    ) ||
    !checkWorkRecording(
      req.files.tenor2RecordingsFromFront,
      req.body.tenor2RecordingDescriptions
    ) ||
    !checkWorkRecording(
      req.files.tuttiRecordingsFromFront,
      req.body.tuttiRecordingDescriptions
    )
  ) {
    res.json({
      result: false,
      error:
        "Non-matching between voice work recording files and its associated descriptions",
    });
    return;
  }

  const userFound = await User.findOne({
    token: req.body.token,
    type: "admin",
  });

  if (userFound) {
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
    const barytonRecordingPaths = [];
    const bassRecordingPaths = [];
    const tenor1RecordingPaths = [];
    const tenor2RecordingPaths = [];
    const tuttiRecordingPaths = [];

    try {
      await partitionFromFront.mv(partitionPath);

      if (
        !Array.isArray(barytonRecordingsFromFront) &&
        barytonRecordingsFromFront
      ) {
        const barytonRecordingPath = `${tmpDir}/${uniqid()}.mp3`;
        await barytonRecordingsFromFront.mv(barytonRecordingPath);
        barytonRecordingPaths.push(barytonRecordingPath);
      } else if (
        Array.isArray(barytonRecordingsFromFront) &&
        barytonRecordingsFromFront.length
      ) {
        for (const barytonRecording of barytonRecordingsFromFront) {
          const barytonRecordingPath = `${tmpDir}/${uniqid()}.mp3`;
          await barytonRecording.mv(barytonRecordingPath);
          barytonRecordingPaths.push(barytonRecordingPath);
        }
      }

      if (!Array.isArray(bassRecordingsFromFront) && bassRecordingsFromFront) {
        const bassRecordingPath = `${tmpDir}/${uniqid()}.mp3`;
        await bassRecordingsFromFront.mv(bassRecordingPath);
        bassRecordingPaths.push(bassRecordingPath);
      } else if (
        Array.isArray(bassRecordingsFromFront) &&
        bassRecordingsFromFront.length
      ) {
        for (const bassRecording of bassRecordingsFromFront) {
          const bassRecordingPath = `${tmpDir}/${uniqid()}.mp3`;
          await bassRecording.mv(bassRecordingPath);
          bassRecordingPaths.push(bassRecordingPath);
        }
      }

      if (
        !Array.isArray(tenor1RecordingsFromFront) &&
        tenor1RecordingsFromFront
      ) {
        const tenor1RecordingPath = `${tmpDir}/${uniqid()}.mp3`;
        await tenor1RecordingsFromFront.mv(tenor1RecordingPath);
        tenor1RecordingPaths.push(tenor1RecordingPath);
      } else if (
        Array.isArray(tenor1RecordingsFromFront) &&
        tenor1RecordingsFromFront.length
      ) {
        for (const tenor1Recording of tenor1RecordingsFromFront) {
          const tenor1RecordingPath = `${tmpDir}/${uniqid()}.mp3`;
          await tenor1Recording.mv(tenor1RecordingPath);
          tenor1RecordingPaths.push(tenor1RecordingPath);
        }
      }

      if (
        !Array.isArray(tenor2RecordingsFromFront) &&
        tenor2RecordingsFromFront
      ) {
        const tenor2RecordingPath = `${tmpDir}/${uniqid()}.mp3`;
        await tenor2RecordingsFromFront.mv(tenor2RecordingPath);
        tenor2RecordingPaths.push(tenor2RecordingPath);
      } else if (
        Array.isArray(tenor2RecordingsFromFront) &&
        tenor2RecordingsFromFront.length
      ) {
        for (const tenor2Recording of tenor2RecordingsFromFront) {
          const tenor2RecordingPath = `${tmpDir}/${uniqid()}.mp3`;
          await tenor2Recording.mv(tenor2RecordingPath);
          tenor2RecordingPaths.push(tenor2RecordingPath);
        }
      }

      if (
        !Array.isArray(tuttiRecordingsFromFront) &&
        tuttiRecordingsFromFront
      ) {
        const tuttiRecordingPath = `${tmpDir}/${uniqid()}.mp3`;
        await tuttiRecordingsFromFront.mv(tuttiRecordingPath);
        tuttiRecordingPaths.push(tuttiRecordingPath);
      } else if (
        Array.isArray(tuttiRecordingsFromFront) &&
        tuttiRecordingsFromFront.length
      ) {
        for (const tuttiRecording of tuttiRecordingsFromFront) {
          const tuttiRecordingPath = `${tmpDir}/${uniqid()}.mp3`;
          await tuttiRecording.mv(tuttiRecordingPath);
          tuttiRecordingPaths.push(tuttiRecordingPath);
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

      if (barytonRecordingPaths.length) {
        for (const barytonRecordingPath of barytonRecordingPaths) {
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

      if (bassRecordingPaths.length) {
        for (const bassRecordingPath of bassRecordingPaths) {
          const bassRecordingResult = await cloudinary.uploader.upload(
            bassRecordingPath,
            {
              resource_type: "video",
              folder: "lcdbp/studiedWorks/audio",
              use_filename: true,
            }
          );
          bassRecordingResults.push(bassRecordingResult);
        }
      }

      if (tenor1RecordingPaths.length) {
        for (const tenor1RecordingPath of tenor1RecordingPaths) {
          const tenor1RecordingResult = await cloudinary.uploader.upload(
            tenor1RecordingPath,
            {
              resource_type: "video",
              folder: "lcdbp/studiedWorks/audio",
              use_filename: true,
            }
          );
          tenor1RecordingResults.push(tenor1RecordingResult);
        }
      }

      if (tenor2RecordingPaths.length) {
        for (const tenor2RecordingPath of tenor2RecordingPaths) {
          const tenor2RecordingResult = await cloudinary.uploader.upload(
            tenor2RecordingPath,
            {
              resource_type: "video",
              folder: "lcdbp/studiedWorks/audio",
              use_filename: true,
            }
          );
          tenor2RecordingResults.push(tenor2RecordingResult);
        }
      }

      if (tuttiRecordingPaths.length) {
        for (const tuttiRecordingPath of tuttiRecordingPaths) {
          const tuttiRecordingResult = await cloudinary.uploader.upload(
            tuttiRecordingPath,
            {
              resource_type: "video",
              folder: "lcdbp/studiedWorks/audio",
              use_filename: true,
            }
          );
          tuttiRecordingResults.push(tuttiRecordingResult);
        }
      }

      fs.unlinkSync(partitionPath);
      if (barytonRecordingPaths.length) {
        for (const barytonRecordingPath of barytonRecordingPaths) {
          fs.unlinkSync(barytonRecordingPath);
        }
      }
      if (bassRecordingPaths.length) {
        for (const bassRecordingPath of bassRecordingPaths) {
          fs.unlinkSync(bassRecordingPath);
        }
      }
      if (tenor1RecordingPaths.length) {
        for (const tenor1RecordingPath of tenor1RecordingPaths) {
          fs.unlinkSync(tenor1RecordingPath);
        }
      }
      if (tenor2RecordingPaths.length) {
        for (const tenor2RecordingPath of tenor2RecordingPaths) {
          fs.unlinkSync(tenor2RecordingPath);
        }
      }
      if (tuttiRecordingPaths.length) {
        for (const tuttiRecordingPath of tuttiRecordingPaths) {
          fs.unlinkSync(tuttiRecordingPath);
        }
      }

      const {
        title,
        code,
        artwork,
        authorMusic,
        isAtWork,
        barytonRecordingDescriptions,
        bassRecordingDescriptions,
        tenor1RecordingDescriptions,
        tenor2RecordingDescriptions,
        tuttiRecordingDescriptions,
      } = req.body;

      const studiedWorkFields = {
        title,
        code,
        partitionUrl: partitionResult.secure_url,
        isAtWork,
        workRecordings: {},
      };

      if (artwork) {
        studiedWorkFields.artwork = artwork;
      }

      if (authorMusic) {
        studiedWorkFields.authorMusic = authorMusic;
      }

      if (barytonRecordingResults.length) {
        studiedWorkFields.workRecordings.baryton = barytonRecordingResults.map(
          (barytonRecordingResult, index) => {
            return {
              recordingUrl: barytonRecordingResult.secure_url,
              recordingDescription:
                barytonRecordingResults.length === 1
                  ? barytonRecordingDescriptions
                  : barytonRecordingDescriptions[index],
            };
          }
        );
      }

      if (bassRecordingResults.length) {
        studiedWorkFields.workRecordings.bass = bassRecordingResults.map(
          (bassRecordingResult, index) => {
            return {
              recordingUrl: bassRecordingResult.secure_url,
              recordingDescription:
                bassRecordingResults.length === 1
                  ? bassRecordingDescriptions
                  : bassRecordingDescriptions[index],
            };
          }
        );
      }

      if (tenor1RecordingResults.length) {
        studiedWorkFields.workRecordings.tenor1 = tenor1RecordingResults.map(
          (tenor1RecordingResult, index) => {
            return {
              recordingUrl: tenor1RecordingResult.secure_url,
              recordingDescription:
                tenor1RecordingResults.length === 1
                  ? tenor1RecordingDescriptions
                  : tenor1RecordingDescriptions[index],
            };
          }
        );
      }

      if (tenor2RecordingResults.length) {
        studiedWorkFields.workRecordings.tenor2 = tenor2RecordingResults.map(
          (tenor2RecordingResult, index) => {
            return {
              recordingUrl: tenor2RecordingResult.secure_url,
              recordingDescription:
                tenor2RecordingResults.length === 1
                  ? tenor2RecordingDescriptions
                  : tenor2RecordingDescriptions[index],
            };
          }
        );
      }

      if (tuttiRecordingResults.length) {
        studiedWorkFields.workRecordings.tutti = tuttiRecordingResults.map(
          (tuttiRecordingResult, index) => {
            return {
              recordingUrl: tuttiRecordingResult.secure_url,
              recordingDescription:
                tuttiRecordingResults.length === 1
                  ? tuttiRecordingDescriptions
                  : tuttiRecordingDescriptions[index],
            };
          }
        );
      }

      const newStudiedWork = new StudiedWork(studiedWorkFields);

      newStudiedWork.save().then((newStudiedWorkDB) => {
        res.json({ result: true, newStudiedWork: newStudiedWorkDB });
      });
    } catch (err) {
      if (fs.existsSync(partitionPath)) {
        fs.unlinkSync(partitionPath);
      }
      if (barytonRecordingPaths.length) {
        for (const barytonRecordingPath of barytonRecordingPaths) {
          if (fs.existsSync(barytonRecordingPath)) {
            fs.unlinkSync(barytonRecordingPath);
          }
        }
      }
      if (bassRecordingPaths.length) {
        for (const bassRecordingPath of bassRecordingPaths) {
          if (fs.existsSync(bassRecordingPath)) {
            fs.unlinkSync(bassRecordingPath);
          }
        }
      }
      if (tenor1RecordingPaths.length) {
        for (const tenor1RecordingPath of tenor1RecordingPaths) {
          if (fs.existsSync(tenor1RecordingPath)) {
            fs.unlinkSync(tenor1RecordingPath);
          }
        }
      }
      if (tenor2RecordingPaths.length) {
        for (const tenor2RecordingPath of tenor2RecordingPaths) {
          if (fs.existsSync(tenor2RecordingPath)) {
            fs.unlinkSync(tenor2RecordingPath);
          }
        }
      }
      if (tuttiRecordingPaths.length) {
        for (const tuttiRecordingPath of tuttiRecordingPaths) {
          if (fs.existsSync(tuttiRecordingPath)) {
            fs.unlinkSync(tuttiRecordingPath);
          }
        }
      }
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
