var express = require("express");
var router = express.Router();

const Contact = require("../models/contacts");
const { checkBody } = require("../modules/checkBody");

router.post("/", (req, res) => {
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

  const newContact = new Contact(contactFields);

  newContact.save().then((newContact) => {
    if (Object.keys(newContact).length) {
      res.json({ result: true, newContact });
    } else {
      res.json({
        result: false,
        error: "Error during the saving of the newContact in DB",
      });
    }
  });
});

module.exports = router;
