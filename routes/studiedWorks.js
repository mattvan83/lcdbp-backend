var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const User = require("../models/users");
const StudiedWork = require("../models/studiedWorks");
const { checkBody } = require("../modules/checkBody");

module.exports = router;
