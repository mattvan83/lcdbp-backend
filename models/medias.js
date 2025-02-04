const mongoose = require("mongoose");

// const mediaType = {
//   IMG: "IMG",
//   AUDIO: "AUDIO",
//   VIDEO: "VIDEO",
// };

const mediaCategory = {
  CONCERT: "CONCERT",
  DETENTE: "DETENTE",
  AGCA: "AGCA",
  WORK: "WORK",
  MEMORIAL: "MEMORIAL",
};

const mediaSchema = new mongoose.Schema(
  {
    mediaDate: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    mediaCategory: {
      type: String,
      required: true,
      enum: Object.values(mediaCategory),
    },
    // mediaType: {
    //   type: String,
    //   required: true,
    //   enum: Object.values(mediaType),
    // },
    mediaUrl: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Media = mongoose.model("medias", mediaSchema);

module.exports = Media;
