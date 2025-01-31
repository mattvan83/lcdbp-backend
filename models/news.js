const mongoose = require("mongoose");

const newsSchema = mongoose.Schema(
  {
    thumbnailUrl: {
      type: String,
      required: true,
    },
    thumbnailDescription: {
      type: String,
      required: true,
    },
    newsDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("news", newsSchema);

module.exports = News;
