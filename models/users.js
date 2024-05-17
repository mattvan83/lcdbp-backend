const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    voice: {
      type: String,
      enum: ["T1", "T2", "B1", "B2"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
      // match: [
      //   /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      //   "Please provide a valid email",
      // ],
    },
    birthDate: {
      type: Date,
      required: true,
    },
    incomingDate: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    address: {
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
    type: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    username: {
      type: String,
      required: false,
      // unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
