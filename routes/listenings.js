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
    const listeningPath = `./tmp/${uniqid()}.mp3`;
    const listeningResultMove = await req.files.listeningFromFront.mv(
      listeningPath
    );

    const thumbnailPath = `./tmp/${uniqid()}.jpg`;
    const thumbnailResultMove = await req.files.thumbnailFromFront.mv(
      thumbnailPath
    );

    if (!listeningResultMove) {
      if (!thumbnailResultMove) {
        const resultCloudinary = await cloudinary.uploader.upload(
          "./tmp/photo.jpg"
        );

        fs.unlinkSync("./tmp/photo.jpg");

        res.json({ result: true, url: resultCloudinary.secure_url });
      } else {
        res.json({ result: false, error: thumbnailResultMove });
      }
    } else {
      res.json({ result: false, error: listeningResultMove });
    }
  } else {
    res.json({
      result: false,
      error: "Administrateur non identifié en base de données",
    });
  }
});

module.exports = router;
