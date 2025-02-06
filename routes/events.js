var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const User = require("../models/users");
const Event = require("../models/events");
const { checkBody } = require("../modules/checkBody");
const { deleteFromCloudinary } = require("../modules/cloudinary");

// Upload event data to Db and Cloudinary under admin rights
router.post("/upload", async (req, res) => {
  if (
    !checkBody(req.body, [
      "token",
      "title",
      "place",
      "postalCode",
      "city",
      "chores",
      "thumbnailDescription",
      "eventDate",
      "price",
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
        folder: "lcdbp/events/images",
        use_filename: true,
      });

      // console.log("imageResult: ", imageResult);

      fs.unlinkSync(thumbnailPath);

      const {
        title,
        place,
        postalCode,
        city,
        thumbnailDescription,
        eventDate,
        price,
      } = req.body;

      // Deserialize the chores array
      const chores = JSON.parse(req.body.chores);

      const eventFields = {
        title,
        place,
        postalCode,
        city,
        chores,
        thumbnailUrl: imageResult.secure_url,
        thumbnailDescription,
        eventDate,
        price,
      };

      const newEvent = new Event(eventFields);

      newEvent.save().then((newEventDB) => {
        res.json({ result: true, newEvent: newEventDB });
      });
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
          folder: "lcdbp/events/images",
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

// Get all up-to-date events in descending order list
router.get("/list", (req, res) => {
  Event.find().then((events) => {
    if (events.length) {
      // Filter out events that have already passed
      const currentDate = new Date();
      const filteredEvents = events.filter((event) => {
        return new Date(event.eventDate) >= currentDate;
      });

      if (filteredEvents.length) {
        // Sort events in descending order
        const sortedEvents = filteredEvents.sort((a, b) => {
          // Sort by recording date first
          const dateComparison = new Date(b.eventDate) - new Date(a.eventDate);
          if (dateComparison !== 0) {
            return dateComparison;
          }
          // If recording dates are equal, sort by title
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        });

        res.json({
          result: true,
          events: sortedEvents,
        });
      } else {
        res.json({ result: false, error: "Events have already passed" });
      }
    } else {
      res.json({ result: false, error: "Events not found" });
    }
  });
});

// Get all up-to-date events in ascending order list
router.get("/listMainPage", (req, res) => {
  Event.find().then((events) => {
    if (events.length) {
      // Filter out events that have already passed
      const currentDate = new Date();
      const filteredEvents = events.filter((event) => {
        return new Date(event.eventDate) >= currentDate;
      });

      if (filteredEvents.length) {
        // Sort events in descending order
        const sortedEvents = filteredEvents.sort((a, b) => {
          // Sort by recording date first
          const dateComparison = new Date(a.eventDate) - new Date(b.eventDate);
          if (dateComparison !== 0) {
            return dateComparison;
          }
          // If recording dates are equal, sort by title
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        });

        res.json({
          result: true,
          events: sortedEvents,
        });
      } else {
        res.json({ result: false, error: "Events have already passed" });
      }
    } else {
      res.json({ result: false, error: "Events not found" });
    }
  });
});

// Get all events grouped by year in descending order
router.get("/grouped", (req, res) => {
  Event.aggregate([
    {
      $addFields: {
        year: { $year: "$eventDate" },
      },
    },
    {
      $group: {
        _id: "$year",
        events: {
          $push: {
            _id: "$_id",
            title: "$title",
            place: "$place",
            postalCode: "$postalCode",
            city: "$city",
            chores: "$chores",
            thumbnailUrl: "$thumbnailUrl",
            thumbnailDescription: "$thumbnailDescription",
            eventDate: "$eventDate",
            price: "$price",
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
        events: {
          $sortArray: {
            input: "$events",
            sortBy: { eventDate: -1 },
          },
        },
      },
    },
    {
      $sort: { year: -1 },
    },
  ]).then((eventsGrouped) => {
    if (eventsGrouped.length) {
      const years = eventsGrouped.map((item) => item.year.toString());

      res.json({ result: true, years, eventsGrouped });
    } else {
      res.json({ result: false, error: "Events not found" });
    }
  });
});

// Delete all events documents specified by ids and all cloudinary files associated
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
      const selectedEvent = await Event.findOne({ _id: id });

      if (!selectedEvent) {
        return res.json({ result: false, error: `Event ${id} not found` });
      }

      // Delete from Cloudinary first
      if (selectedEvent.thumbnailUrl) {
        await deleteFromCloudinary(selectedEvent.thumbnailUrl);
      }

      // Then delete from MongoDB
      await Event.deleteOne({ _id: id });
    }

    res.json({
      result: true,
      message: "All selected events were successfully deleted",
    });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
});

module.exports = router;
