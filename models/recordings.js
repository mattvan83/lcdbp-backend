const mongoose = require("mongoose");

const VoiceType = {
  BARYTON: "BARYTON",
  BASS: "BASS",
  TENOR1: "TENOR1",
  TENOR2: "TENOR2",
  TUTTI: "TUTTI",
};

const recordingSchema = new mongoose.Schema(
  {
    recordingUrl: {
      type: String,
      required: false,
    },
    recordingDescription: {
      type: String,
      required: false,
      trim: true,
    },
    voiceType: {
      type: String,
      required: true,
      enum: Object.values(VoiceType),
    },
    workId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "works",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recording = mongoose.model("recordings", recordingSchema);

module.exports = Recording;
