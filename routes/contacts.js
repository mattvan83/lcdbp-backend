var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const sendGridMail = require("@sendgrid/mail");

const Contact = require("../models/contacts");
const { checkBody } = require("../modules/checkBody");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    .join("\n\n");

  const newContact = new Contact(contactFields);
  await newContact.save();

  // // Use nodemailer
  // let transporter = nodemailer.createTransport({
  //   host: "smtp-mail.outlook.com",
  //   // host: "smtp.office365.com",
  //   port: 587,
  //   secure: false,
  //   auth: {
  //     user: process.env.OUTLOOK_EMAIL,
  //     pass: process.env.OUTLOOK_PASSWORD,
  //   },
  //   tls: {
  //     ciphers: "SSLv3",
  //     rejectUnauthorized: false,
  //   },
  // });

  // let mailOptions = {
  //   from: process.env.OUTLOOK_EMAIL,
  //   to: process.env.OUTLOOK_EMAIL,
  //   cc: ownCopy ? email : "",
  //   subject: "New Message from Contact Form",
  //   text: emailContent,
  //   //  html: "<b>Hello world?</b>",
  // };

  // try {
  //   await transporter.sendMail(mailOptions);
  //   res.status(200).json({ result: true, newContact });
  // } catch (error) {
  //   res.status(500).json({
  //     result: false,
  //     error: error,
  //   });
  // }

  // Use SendGrid
  // console.log("OUTLOOK_EMAIL: ", process.env.OUTLOOK_EMAIL);

  const mailOptions = {
    to: process.env.OUTLOOK_EMAIL,
    from: {
      email: GMAIL_ADDRESS, // From Email Address
      name: "LCDBP application",
    },
    reply_to: {
      email: process.env.OUTLOOK_EMAIL, // Reply To Email Address
      name: "Le Choeur du Bon Pays",
    },
    subject: "New Message from Contact Form",
    text: emailContent,
    // html: `<strong>${emailContent}</strong>`,
    cc: ownCopy ? email : "",
  };

  try {
    await sendGridMail.send(mailOptions);
    res.status(200).json({ result: true, newContact });
  } catch (error) {
    res.status(500).json({
      result: false,
      error: error,
    });
  }
});

module.exports = router;
