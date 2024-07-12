const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    place: {
      type: String,
      required: true,
      trim: true,
    },
    chores: {
      type: [String],
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    thumbnailDescription: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
