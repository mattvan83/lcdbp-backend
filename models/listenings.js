const mongoose = require("mongoose");

const listeningSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artwork: {
      type: String,
      required: false,
      trim: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    authorText: {
      type: String,
      required: false,
      trim: true,
    },
    authorMusic: {
      type: String,
      required: true,
      trim: true,
    },
    arrangement: {
      type: String,
      required: false,
    },
    harmonization: {
      type: String,
      required: false,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    thumbnailDescription: {
      type: String,
      required: true,
    },
    recordingDate: {
      type: Date,
      required: true,
    },
    lastListening: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Listening = mongoose.model("listenings", listeningSchema);

module.exports = Listening;
