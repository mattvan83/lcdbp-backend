const mongoose = require("mongoose");

const RecordingSchema = new mongoose.Schema({
  recordingUrl: {
    type: String,
    required: false,
  },
  recordingDescription: {
    type: String,
    required: false,
    trim: true,
  },
});

const WorkRecordingsSchema = new mongoose.Schema({
  baryton: [RecordingSchema],
  bass: [RecordingSchema],
  tenor1: [RecordingSchema],
  tenor2: [RecordingSchema],
  tutti: [RecordingSchema],
});

const studiedWorkSchema = new mongoose.Schema(
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
    workRecordings: {
      type: WorkRecordingsSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const StudiedWork = mongoose.model("studiedWorks", studiedWorkSchema);

module.exports = StudiedWork;
