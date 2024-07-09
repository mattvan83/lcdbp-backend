const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
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
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    ownCopy: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("contacts", contactSchema);

module.exports = Contact;
