const mongoose = require("mongoose");

const pressReviewSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    journal: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    thumbnailDescription: {
      type: String,
      required: true,
    },
    pressReviewDate: {
      type: Date,
      required: true,
    },
    lastPressReview: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PressReview = mongoose.model("pressReviews", pressReviewSchema);

module.exports = PressReview;
