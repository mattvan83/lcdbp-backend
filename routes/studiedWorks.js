var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const pdf2image = require("pdf2image");

const User = require("../models/users");
const StudiedWork = require("../models/studiedWorks");
const Work = require("../models/works");
const Recording = require("../models/recordings");
const { checkBody, checkWorkRecording } = require("../modules/checkBody");
const { deleteFromCloudinary } = require("../modules/cloudinary");

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
    const partitionThumbnailPath = `${tmpDir}/${uniqid()}.png`;
    const barytonRecordingPaths = [];
    const bassRecordingPaths = [];
    const tenor1RecordingPaths = [];
    const tenor2RecordingPaths = [];
    const tuttiRecordingPaths = [];

    try {
      // Move partition file to a unique temp path
      await partitionFromFront.mv(partitionPath);

      // Convert partition first page to thumbnail and save it to a unique temp path
      const options = {
        density: 300, // image resolution
        // quality: 200, // jpeg quality
        outputFormat: "%s_page_%d",
        outputType: "png",
        pages: "1",
      };

      const images = await pdf2image.convertPDF(partitionPath, options);
      const imagePath = images[0].path;
      fs.renameSync(imagePath, partitionThumbnailPath);

      // Move recording files to unique temp paths
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

      const partitionThumbnailResult = await cloudinary.uploader.upload(
        partitionThumbnailPath,
        {
          resource_type: "image",
          folder: "lcdbp/studiedWorks/partitions",
          use_filename: true,
        }
      );

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
      fs.unlinkSync(partitionThumbnailPath);
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
        partitionThumbnailUrl: partitionThumbnailResult.secure_url,
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
      if (fs.existsSync(partitionThumbnailPath)) {
        fs.unlinkSync(partitionThumbnailPath);
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

router.post("/uploadWorks", async (req, res) => {
  // // Set a longer timeout for this specific route
  // req.setTimeout(300000); // 5 minutes

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

  if (!userFound) {
    res.json({
      result: false,
      error: "Administrateur non identifié en base de données",
    });
    return;
  }

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
  const partitionThumbnailPath = `${tmpDir}/${uniqid()}.png`;
  const barytonRecordingPaths = [];
  const bassRecordingPaths = [];
  const tenor1RecordingPaths = [];
  const tenor2RecordingPaths = [];
  const tuttiRecordingPaths = [];

  try {
    // Move partition file to a unique temp path
    await partitionFromFront.mv(partitionPath);

    // Convert partition first page to thumbnail and save it to a unique temp path
    const options = {
      density: 300, // image resolution
      // quality: 200, // jpeg quality
      outputFormat: "%s_page_%d",
      outputType: "png",
      pages: "1",
    };

    const images = await pdf2image.convertPDF(partitionPath, options);
    const imagePath = images[0].path;
    fs.renameSync(imagePath, partitionThumbnailPath);

    // Move recording files to unique temp paths
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

    if (!Array.isArray(tuttiRecordingsFromFront) && tuttiRecordingsFromFront) {
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

  try {
    const partitionResult = await cloudinary.uploader.upload(partitionPath, {
      resource_type: "raw",
      folder: "lcdbp/works/partitions",
      use_filename: true,
    });

    const partitionThumbnailResult = await cloudinary.uploader.upload(
      partitionThumbnailPath,
      {
        resource_type: "image",
        folder: "lcdbp/works/partitions",
        use_filename: true,
      }
    );

    // Create the Work document first
    const workFields = {
      title: req.body.title,
      code: req.body.code,
      partitionUrl: partitionResult.secure_url,
      partitionThumbnailUrl: partitionThumbnailResult.secure_url,
      isAtWork: req.body.isAtWork,
    };

    if (req.body.artwork) {
      workFields.artwork = req.body.artwork;
    }

    if (req.body.authorMusic) {
      workFields.authorMusic = req.body.authorMusic;
    }

    const newWork = new Work(workFields);
    const savedWork = await newWork.save();

    const createRecordings = async (
      recordingPaths,
      recordingDescriptions,
      voiceType
    ) => {
      const recordings = [];
      for (let i = 0; i < recordingPaths.length; i++) {
        const recordingResult = await cloudinary.uploader.upload(
          recordingPaths[i],
          {
            resource_type: "video",
            folder: "lcdbp/works/audio",
            use_filename: true,
            timeout: 120000,
          }
        );

        const recording = new Recording({
          recordingUrl: recordingResult.secure_url,
          recordingDescription:
            recordingPaths.length === 1
              ? recordingDescriptions
              : recordingDescriptions[i],
          voiceType,
          workId: savedWork._id,
        });

        recordings.push(await recording.save());
      }
      return recordings;
    };

    // Create recordings for each voice type sequentially
    if (barytonRecordingPaths.length) {
      await createRecordings(
        barytonRecordingPaths,
        req.body.barytonRecordingDescriptions,
        "BARYTON"
      );
    }

    if (bassRecordingPaths.length) {
      await createRecordings(
        bassRecordingPaths,
        req.body.bassRecordingDescriptions,
        "BASS"
      );
    }

    if (tenor1RecordingPaths.length) {
      await createRecordings(
        tenor1RecordingPaths,
        req.body.tenor1RecordingDescriptions,
        "TENOR1"
      );
    }

    if (tenor2RecordingPaths.length) {
      await createRecordings(
        tenor2RecordingPaths,
        req.body.tenor2RecordingDescriptions,
        "TENOR2"
      );
    }

    if (tuttiRecordingPaths.length) {
      await createRecordings(
        tuttiRecordingPaths,
        req.body.tuttiRecordingDescriptions,
        "TUTTI"
      );
    }

    fs.unlinkSync(partitionPath);
    fs.unlinkSync(partitionThumbnailPath);
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

    // Fetch the work with its recordings
    const workWithRecordings = await Work.findById(savedWork._id).populate(
      "recordings"
    );

    res.json({ result: true, newWork: workWithRecordings });
  } catch (err) {
    // Add more detailed error logging
    console.error("Upload error:", err);

    if (fs.existsSync(partitionPath)) {
      fs.unlinkSync(partitionPath);
    }
    if (fs.existsSync(partitionThumbnailPath)) {
      fs.unlinkSync(partitionThumbnailPath);
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
      details: err.stack,
    });
  }
});

router.post("/uploadPartition", async (req, res) => {
  if (
    !checkBody(req.body, ["token"]) ||
    !checkBody(req.files, ["partitionFromFront"])
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

  const { partitionFromFront } = req.files;

  try {
    const uniqueFilename = `${uniqid()}.pdf`;
    const partitionResult = await cloudinary.uploader.upload(
      partitionFromFront.tempFilePath,
      {
        resource_type: "raw",
        folder: "lcdbp/works/partitions",
        public_id: uniqueFilename,
        use_filename: false,
        timeout: 120000,
        chunk_size: 6000000,
        eager_async: true,
      }
    );

    res.json({ result: true, partitionUrl: partitionResult.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.json({
      result: false,
      error: "Error uploading to Cloudinary: " + (err.message || err),
    });
  }
});

router.post("/uploadPartitionThumbnail", async (req, res) => {
  if (
    !checkBody(req.body, ["token"]) ||
    !checkBody(req.files, ["partitionThumbnailFromFront"])
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

  const { partitionThumbnailFromFront } = req.files;

  // try {
  //   // Convert partition first page to thumbnail and save it to a unique temp path
  //   const options = {
  //     density: 300, // image resolution
  //     // quality: 200, // jpeg quality
  //     outputFormat: "%s_page_%d",
  //     outputType: "png",
  //     pages: "1",
  //   };

  //   const images = await pdf2image.convertPDF(partitionPath, options);
  //   const imagePath = images[0].path;
  //   fs.renameSync(imagePath, partitionThumbnailPath);
  // } catch (err) {
  //   res.json({
  //     result: false,
  //     error:
  //       "Error converting first page of .pdf partition to .png: " + err.message,
  //   });
  //   return;
  // }

  try {
    const uniqueFilename = uniqid();
    const partitionThumbnailResult = await cloudinary.uploader.upload(
      partitionThumbnailFromFront.tempFilePath,
      {
        resource_type: "image",
        folder: "lcdbp/works/partitions",
        public_id: uniqueFilename,
        use_filename: false,
        timeout: 120000,
        chunk_size: 6000000,
        eager_async: true,
      }
    );

    res.json({
      result: true,
      partitionThumbnailUrl: partitionThumbnailResult.secure_url,
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.json({
      result: false,
      error: "Error uploading to Cloudinary: " + (err.message || err),
    });
  }
});

// router.post("/uploadRecording", async (req, res) => {
//   if (
//     !checkBody(req.body, ["token"]) ||
//     !checkBody(req.files, ["recordingFromFront"])
//   ) {
//     res.json({ result: false, error: "Missing or empty fields" });
//     return;
//   }

//   const userFound = await User.findOne({
//     token: req.body.token,
//     type: "admin",
//   });

//   if (!userFound) {
//     res.json({
//       result: false,
//       error: "Administrateur non identifié en base de données",
//     });
//     return;
//   }

//   const { recordingFromFront } = req.files;

//   try {
//     const uniqueFilename = uniqid();
//     const recordingResult = await cloudinary.uploader.upload(
//       recordingFromFront.tempFilePath,
//       {
//         resource_type: "video",
//         folder: "lcdbp/works/audio",
//         public_id: uniqueFilename,
//         use_filename: false,
//         timeout: 120000,
//         chunk_size: 6000000,
//         eager_async: true,
//       }
//     );

//     res.json({ result: true, recordingUrl: recordingResult.secure_url });
//   } catch (err) {
//     console.error("Cloudinary upload error:", err);
//     res.json({
//       result: false,
//       error: "Error uploading to Cloudinary: " + (err.message || err),
//     });
//   }
// });

router.post("/uploadRecording", async (req, res) => {
  if (!checkBody(req.body, ["token"])) {
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
    const timestamp = Math.round(new Date().getTime() / 1000);
    const uniqueFilename = uniqid();

    // Create params object with all required fields
    const paramsToSign = {
      eager_async: true,
      folder: "lcdbp/works/audio",
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
});

router.post("/uploadRecordingComplete", async (req, res) => {
  if (!checkBody(req.body, ["token", "recordingUrl"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const userFound = await User.findOne({
    token: req.body.token,
    type: "admin",
  });

  if (userFound) {
    res.json({ result: true, recordingUrl: req.body.recordingUrl });
  } else {
    res.json({
      result: false,
      error: "Administrateur non identifié en base de données",
    });
  }
});

// Get all partitions grouped by category in ascending order
router.get("/groupedPartitions", async (req, res) => {
  StudiedWork.aggregate([
    {
      $addFields: {
        category: { $substr: ["$code", 0, 1] },
      },
    },
    {
      $group: {
        _id: "$category",
        partitions: {
          $push: {
            _id: "$_id",
            code: "$code",
            title: "$title",
            artwork: "$artwork",
            partitionUrl: "$partitionUrl",
            partitionThumbnailUrl: "$partitionThumbnailUrl",
            authorMusic: "$authorMusic",
            isAtWork: "$isAtWork",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        partitions: {
          $sortArray: {
            input: "$partitions",
            sortBy: { code: 1, title: 1 },
          },
        },
      },
    },
    {
      $sort: { category: 1 },
    },
  ]).then((partitionsGrouped) => {
    if (partitionsGrouped.length) {
      const categories = partitionsGrouped.map((item) => item.category);

      res.json({ result: true, categories, partitionsGrouped });
    } else {
      res.json({ result: false, error: "Partitions not found" });
    }
  });
});

// Get all partitions grouped by category in ascending order
router.post("/groupedPartitionsWorks", async (req, res) => {
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const userFound = await User.findOne({
    token: req.body.token,
  });

  if (userFound) {
    Work.aggregate([
      {
        $addFields: {
          category: { $substr: ["$code", 0, 1] },
        },
      },
      {
        $group: {
          _id: "$category",
          partitions: {
            $push: {
              _id: "$_id",
              code: "$code",
              title: "$title",
              artwork: "$artwork",
              partitionUrl: "$partitionUrl",
              partitionThumbnailUrl: "$partitionThumbnailUrl",
              authorMusic: "$authorMusic",
              isAtWork: "$isAtWork",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          partitions: {
            $sortArray: {
              input: "$partitions",
              sortBy: { code: 1, title: 1 },
            },
          },
        },
      },
      {
        $sort: { category: 1 },
      },
    ]).then((partitionsGrouped) => {
      if (partitionsGrouped.length) {
        const categories = partitionsGrouped.map((item) => item.category);

        res.json({ result: true, categories, partitionsGrouped });
      } else {
        res.json({ result: false, error: "Partitions not found" });
      }
    });
  } else {
    res.json({
      result: false,
      error: "Membre non identifié en base de données",
    });
  }
});

// Get all work recordings grouped by voice in ascending order (title, recordingDescription)
router.get("/groupedWorkRecordings", async (req, res) => {
  StudiedWork.aggregate([
    {
      $addFields: {
        workRecordingsArray: { $objectToArray: "$workRecordings" },
      },
    },
    {
      $addFields: {
        workRecordingsArray: {
          $filter: {
            input: "$workRecordingsArray",
            cond: {
              $and: [{ $ne: ["$$this.k", "_id"] }, { $ne: ["$$this.v", []] }],
            },
          },
        },
      },
    },
    {
      $unwind: {
        path: "$workRecordingsArray",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $unwind: {
        path: "$workRecordingsArray.v",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $addFields: {
        "workRecordingsArray.v.title": "$title",
        "workRecordingsArray.v.artwork": "$artwork",
        "workRecordingsArray.v.partitionUrl": "$partitionUrl",
        "workRecordingsArray.v.partitionThumbnailUrl": "$partitionThumbnailUrl",
        "workRecordingsArray.v.authorMusic": "$authorMusic",
        "workRecordingsArray.v.createdAt": "$createdAt",
        "workRecordingsArray.v.updatedAt": "$updatedAt",
      },
    },
    {
      $group: {
        _id: "$workRecordingsArray.k",
        workRecordings: {
          $push: "$workRecordingsArray.v",
        },
      },
    },
    {
      $project: {
        _id: 0,
        voice: "$_id",
        workRecordings: {
          $sortArray: {
            input: "$workRecordings",
            sortBy: { title: 1, recordingDescription: 1 },
          },
        },
      },
    },
    {
      $sort: { voice: 1 },
    },
  ]).then((workRecordingsGrouped) => {
    if (workRecordingsGrouped.length) {
      const voices = workRecordingsGrouped.map((item) => item.voice);

      res.json({ result: true, voices, workRecordingsGrouped });
    } else {
      res.json({ result: false, error: "Work recordings not found" });
    }
  });
});

router.post("/groupedRecordingsWorks", async (req, res) => {
  if (!checkBody(req.body, ["token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const userFound = await User.findOne({
    token: req.body.token,
  });

  if (userFound) {
    try {
      const workRecordingsGrouped = await Work.aggregate([
        {
          $lookup: {
            from: "recordings",
            localField: "_id",
            foreignField: "workId",
            as: "recordings",
          },
        },
        {
          $unwind: {
            path: "$recordings",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $group: {
            _id: "$recordings.voiceType",
            workRecordings: {
              $push: {
                _id: "$recordings._id",
                recordingUrl: "$recordings.recordingUrl",
                recordingDescription: "$recordings.recordingDescription",
                title: "$title",
                artwork: "$artwork",
                partitionUrl: "$partitionUrl",
                partitionThumbnailUrl: "$partitionThumbnailUrl",
                authorMusic: "$authorMusic",
                createdAt: "$createdAt",
                updatedAt: "$updatedAt",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            voice: "$_id",
            workRecordings: {
              $sortArray: {
                input: "$workRecordings",
                sortBy: { title: 1, recordingDescription: 1 },
              },
            },
          },
        },
        {
          $sort: { voice: 1 },
        },
      ]);

      if (workRecordingsGrouped.length) {
        const voices = workRecordingsGrouped.map((item) => item.voice);
        res.json({ result: true, voices, workRecordingsGrouped });
      } else {
        res.json({ result: false, error: "Work recordings not found" });
      }
    } catch (error) {
      res.json({ result: false, error: error.message });
    }
  } else {
    res.json({
      result: false,
      error: "Membre non identifié en base de données",
    });
  }
});

// Delete all recordings documents specified by ids and all cloudinary files associated
router.post("/deleteAllRecordings", async (req, res) => {
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
      const selectedRecording = await Recording.findOne({ _id: id });

      if (!selectedRecording) {
        return res.json({ result: false, error: `Recording ${id} not found` });
      }

      // Delete from Cloudinary first
      if (selectedRecording.recordingUrl) {
        await deleteFromCloudinary(selectedRecording.recordingUrl);
      }

      // Then delete from MongoDB
      await Recording.deleteOne({ _id: id });
    }

    res.json({
      result: true,
      message: "All selected recordings were successfully deleted",
    });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

// Delete all works documents specified by ids, recordings documents and cloudinary files associated
router.post("/deleteAllWorks", async (req, res) => {
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
      const selectedWork = await Work.findOne({ _id: id }).populate(
        "recordings"
      );

      if (!selectedWork) {
        return res.json({ result: false, error: `Work ${id} not found` });
      }

      if (selectedWork.recordings.length) {
        for (const recording of selectedWork.recordings) {
          if (recording.recordingUrl) {
            await deleteFromCloudinary(recording.recordingUrl);
          }

          await Recording.deleteOne({ _id: recording._id });
        }
      }

      if (selectedWork.partitionUrl) {
        await deleteFromCloudinary(selectedWork.partitionUrl);
      }
      if (selectedWork.partitionThumbnailUrl) {
        await deleteFromCloudinary(selectedWork.partitionThumbnailUrl);
      }

      await Work.deleteOne({ _id: id });
    }

    res.json({
      result: true,
      message: "All selected works were successfully deleted",
    });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
