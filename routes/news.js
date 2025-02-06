var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const User = require("../models/users");
const News = require("../models/news");
const { checkBody } = require("../modules/checkBody");
const { deleteFromCloudinary } = require("../modules/cloudinary");

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

    // const { imageExtension } = req.body;

    // const tmpDir = "./tmp";
    // if (!fs.existsSync(tmpDir)) {
    //   fs.mkdirSync(tmpDir);
    // }

    // const thumbnailPath = `${tmpDir}/${uniqid()}${imageExtension}`;

    // try {
    //   await thumbnailFromFront.mv(thumbnailPath);
    // } catch (err) {
    //   res.json({ result: false, error: "Error moving files: " + err.message });
    //   return;
    // }

    try {
      // const imageResult = await cloudinary.uploader.upload(thumbnailPath, {
      //   resource_type: "image",
      //   folder: "lcdbp/news/images",
      //   use_filename: true,
      // });

      const uniqueFilename = uniqid();
      const imageResult = await cloudinary.uploader.upload(
        thumbnailFromFront.tempFilePath,
        {
          resource_type: "image",
          folder: "lcdbp/news/images",
          public_id: uniqueFilename, // This will control the filename
          use_filename: false, //
        }
      );

      // fs.unlinkSync(thumbnailPath);

      res.json({ result: true, thumbnailUrl: imageResult.secure_url });
    } catch (err) {
      // if (fs.existsSync(thumbnailPath)) {
      //   fs.unlinkSync(thumbnailPath);
      // }
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

// Get all up-to-date news in list
router.get("/list", (req, res) => {
  News.find().then((news) => {
    if (news.length) {
      // Filter out news that have already passed
      const currentDate = new Date();
      const filteredNews = news.filter((news) => {
        return new Date(news.newsDate) >= currentDate;
      });

      if (filteredNews.length) {
        // Sort news in ascending order
        const sortedNews = filteredNews.sort((a, b) => {
          // Sort by recording date first
          return new Date(a.newsDate) - new Date(b.newsDate);
        });

        res.json({
          result: true,
          news: sortedNews,
        });
      } else {
        res.json({ result: false, error: "News have already passed" });
      }
    } else {
      res.json({ result: false, error: "News not found" });
    }
  });
});

// Delete all news documents specified by ids and all cloudinary files associated
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
      const selectedNews = await News.findOne({ _id: id });

      if (!selectedNews) {
        return res.json({ result: false, error: `News ${id} not found` });
      }

      // Delete from Cloudinary first
      if (selectedNews.thumbnailUrl) {
        await deleteFromCloudinary(selectedNews.thumbnailUrl);
      }

      // Then delete from MongoDB
      await News.deleteOne({ _id: id });
    }

    res.json({
      result: true,
      message: "All selected news were successfully deleted",
    });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
