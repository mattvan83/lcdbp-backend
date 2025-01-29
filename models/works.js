const mongoose = require("mongoose");

const workSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
    },
    artwork: {
      type: String,
      required: false,
      trim: true,
    },
    partitionUrl: {
      type: String,
      required: true,
    },
    partitionThumbnailUrl: {
      type: String,
      required: false,
    },
    authorMusic: {
      type: String,
      required: false,
      trim: true,
    },
    isAtWork: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for recordings
workSchema.virtual("recordings", {
  ref: "recordings",
  localField: "_id",
  foreignField: "workId",
});

const Work = mongoose.model("works", workSchema);

module.exports = Work;
