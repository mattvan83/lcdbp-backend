var express = require("express");
var router = express.Router();

const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");
const uniqid = require("uniqid");

/* USER CREATION */
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
          res.json({ result: true, newUser });
        });
      } else {
        // User already exists in database
        res.json({ result: false, error: `User ${email} already exists` });
      }
    }
  );
});

/* ACCOUNT CREATION */
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["email", "username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const { email, username } = req.body;

  // Check if the user with email ${email} has been created by the admin
  User.findOne({
    email: { $regex: new RegExp(email, "i") },
  }).then((userByEmail) => {
    if (userByEmail) {
      if (!userByEmail.username || !userByEmail.password) {
        User.findOne({
          username: { $regex: new RegExp(username, "i") },
        }).then((userByUsername) => {
          if (!userByUsername) {
            const { password } = req.body;
            const hash = bcrypt.hashSync(password, 10);

            userByEmail.username = username;
            userByEmail.password = hash;
            userByEmail.token = uid2(32);

            userByEmail.save().then((newUser) => {
              res.json({
                result: true,
                token: newUser.token,
                username: newUser.username,
              });
            });
          } else {
            // Username
            res.json({
              result: false,
              error: `Le nom d'utilisateur ${username} existe déjà`,
            });
          }
        });
      } else {
        // User with email ${email} has already sign-up
        res.json({
          result: false,
          error: `User account with email ${email} has already been created`,
        });
      }
    } else {
      // User with email ${email} hasn't be created by the admin
      res.json({
        result: false,
        error: `L'email ${email} n'a pas les droits pour rejoindre l'espace membres. Contactez votre administrateur.`,
      });
    }
  });
});

/* ACCOUNT CONNECTION */
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const { username, password } = req.body;

  User.findOne({ username: { $regex: new RegExp(username, "i") } }).then(
    (userByUsername) => {
      if (!userByUsername) {
        res.json({
          result: false,
          error: `L'utilisateur ${username} n'a pas été trouvé`,
        });
      } else {
        if (
          userByUsername &&
          bcrypt.compareSync(password, userByUsername.password)
        ) {
          res.json({
            result: true,
            token: userByUsername.token,
            username: userByUsername.username,
          });
        } else {
          res.json({ result: false, error: "Mauvais mot de passe" });
        }
      }
    }
  );
});

// /* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });

module.exports = router;
