var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const User = require("../models/users");
const PressReview = require("../models/pressReviews");
const { checkBody } = require("../modules/checkBody");
const { deleteFromCloudinary } = require("../modules/cloudinary");

// Upload press review data to Db and Cloudinary under admin rights
router.post("/upload", async (req, res) => {
  if (
    !checkBody(req.body, [
      "token",
      "title",
      "journal",
      "city",
      "thumbnailDescription",
      "pressReviewDate",
      "lastPressReview",
      "imageExtension",
    ]) ||
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

    const { imageExtension } = req.body;

    const tmpDir = "./tmp";
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    const thumbnailPath = `${tmpDir}/${uniqid()}${imageExtension}`;

    try {
      await thumbnailFromFront.mv(thumbnailPath);
    } catch (err) {
      res.json({ result: false, error: "Error moving files: " + err.message });
      return;
    }

    try {
      const imageResult = await cloudinary.uploader.upload(thumbnailPath, {
        resource_type: "image",
        folder: "lcdbp/pressReviews/images",
        use_filename: true,
      });

      // console.log("imageResult: ", imageResult);

      fs.unlinkSync(thumbnailPath);

      const {
        title,
        journal,
        city,
        thumbnailDescription,
        pressReviewDate,
        lastPressReview,
      } = req.body;

      const pressReviewFields = {
        title,
        journal,
        city,
        thumbnailUrl: imageResult.secure_url,
        thumbnailDescription,
        pressReviewDate,
        lastPressReview,
      };

      const newPressReview = new PressReview(pressReviewFields);

      newPressReview.save().then((newPressReviewDB) => {
        res.json({ result: true, newPressReview: newPressReviewDB });
      });
    } catch (err) {
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

router.post("/uploadThumbnail", async (req, res) => {
  if (
    !checkBody(req.body, ["token", "imageExtension"]) ||
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

    const { imageExtension } = req.body;

    const tmpDir = "./tmp";
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    const thumbnailPath = `${tmpDir}/${uniqid()}${imageExtension}`;

    try {
      await thumbnailFromFront.mv(thumbnailPath);
    } catch (err) {
      res.json({ result: false, error: "Error moving files: " + err.message });
      return;
    }

    try {
      const imageResult = await cloudinary.uploader.upload(thumbnailPath, {
        resource_type: "image",
        folder: "lcdbp/pressReviews/images",
        use_filename: true,
      });

      fs.unlinkSync(thumbnailPath);

      res.json({ result: true, thumbnailUrl: imageResult.secure_url });
    } catch (err) {
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
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

// Get all press reviews in list
router.get("/list", (req, res) => {
  PressReview.find().then((pressReviews) => {
    if (pressReviews.length) {
      const sortedPressReviews = pressReviews.sort((a, b) => {
        // Sort by recording date first
        const dateComparison =
          new Date(b.pressReviewDate) - new Date(a.pressReviewDate);
        if (dateComparison !== 0) {
          return dateComparison;
        }
        // If recording dates are equal, sort by title
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      });

      res.json({
        result: true,
        pressReviews: sortedPressReviews,
      });
    } else {
      res.json({ result: false, error: "Press reviews not found" });
    }
  });
});

// Get all press reviews grouped by year in descending order
router.get("/grouped", (req, res) => {
  PressReview.aggregate([
    {
      $addFields: {
        year: { $year: "$pressReviewDate" },
      },
    },
    {
      $group: {
        _id: "$year",
        pressReviews: {
          $push: {
            _id: "$_id",
            title: "$title",
            journal: "$journal",
            city: "$city",
            thumbnailUrl: "$thumbnailUrl",
            thumbnailDescription: "$thumbnailDescription",
            pressReviewDate: "$pressReviewDate",
            lastPressReview: "$lastPressReview",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id",
        pressReviews: {
          $sortArray: {
            input: "$pressReviews",
            sortBy: { pressReviewDate: -1 },
          },
        },
      },
    },
    {
      $sort: { year: -1 },
    },
  ]).then((pressReviewsGrouped) => {
    if (pressReviewsGrouped.length) {
      const years = pressReviewsGrouped.map((item) => item.year.toString());

      res.json({ result: true, years, pressReviewsGrouped });
    } else {
      res.json({ result: false, error: "Press reviews not found" });
    }
  });
});

// Delete all pressReviews documents specified by ids and all cloudinary files associated
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
      const selectedPressReview = await PressReview.findOne({ _id: id });

      if (!selectedPressReview) {
        return res.json({
          result: false,
          error: `PressReview ${id} not found`,
        });
      }

      // Delete from Cloudinary first
      if (selectedPressReview.thumbnailUrl) {
        await deleteFromCloudinary(selectedPressReview.thumbnailUrl);
      }

      // Then delete from MongoDB
      await PressReview.deleteOne({ _id: id });
    }

    res.json({
      result: true,
      message: "All selected pressReviews were successfully deleted",
    });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
