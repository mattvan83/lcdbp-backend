var express = require("express");
var router = express.Router();

const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const uniqid = require("uniqid");

router.post("/create", (req, res) => {
  if (
    !checkBody(req.body, [
      "firstname",
      "lastname",
      "voice",
      "email",
      "birthDate",
      "incomingDate",
      "address",
      "postalCode",
      "city",
      "type",
    ])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ email: { $regex: new RegExp(req.body.email, "i") } }).then(
    (data) => {
      if (!data) {
        const {
          firstname,
          lastname,
          voice,
          email,
          birthDate,
          incomingDate,
          phone,
          mobile,
          address,
          postalCode,
          city,
          type,
        } = req.body;

        const userFields = {
          firstname,
          lastname,
          voice,
          email,
          birthDate,
          incomingDate,
          address,
          postalCode,
          city,
          type,
        };

        if (phone) {
          userFields.phone = phone;
        }

        if (mobile) {
          userFields.mobile = mobile;
        }

        const newUser = new User(userFields);

        newUser.save().then((newUser) => {
          res.json({ result: true });
        });
      } else {
        // User already exists in database
        res.json({ result: false, error: `User ${email} already exists` });
      }
    }
  );
});

// /* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });

module.exports = router;
