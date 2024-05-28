var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const User = require("../models/users");
const Listening = require("../models/listenings");
const { checkBody } = require("../modules/checkBody");

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

module.exports = router;
