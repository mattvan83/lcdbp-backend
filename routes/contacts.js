var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const Contact = require("../models/contacts");
const { checkBody } = require("../modules/checkBody");

// Gmail credentials
const GMAIL_ADDRESS = process.env.GMAIL_ADDRESS;
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const GMAIL_REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;

const oauth2Client = new OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: GMAIL_REFRESH_TOKEN,
});

async function createTransporter() {
  const accessToken = await oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: GMAIL_ADDRESS,
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  return transporter;
}

router.post("/", async (req, res) => {
  if (
    !checkBody(req.body, [
      "firstname",
      "lastname",
      "email",
      "message",
      "ownCopy",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const { firstname, lastname, email, phone, message, ownCopy } = req.body;

  const contactFields = {
    firstname,
    lastname,
    email,
    message,
    ownCopy,
  };

  if (phone) {
    contactFields.phone = phone;
  }

  const emailContent = [
    `Nom: ${firstname} ${lastname}`,
    `Email: ${email}`,
    phone ? `Téléphone: ${phone}` : "",
    `Message: ${message}`,
  ]
    .filter(Boolean)
    .join("\n");

  const mailOptions = {
    from: GMAIL_ADDRESS,
    to: GMAIL_ADDRESS,
    subject: "New Message from Contact Form",
    text: emailContent,
  };

  try {
    const newContact = new Contact(contactFields);
    await newContact.save();

    const transporter = await createTransporter();
    // console.log("transporter: ", transporter);

    await transporter.sendMail(mailOptions);

    res.status(200).json({ result: true, newContact });
  } catch (error) {
    res.status(500).json({
      result: false,
      error: error,
    });
  }
});

module.exports = router;
