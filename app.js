require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

require("./models/connection");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var contactsRouter = require("./routes/contacts");
var listeningsRouter = require("./routes/listenings");
var pressReviewsRouter = require("./routes/pressReviews");
var eventsRouter = require("./routes/events");
var studiedWorksRouter = require("./routes/studiedWorks");
var newsRouter = require("./routes/news");
var mediasRouter = require("./routes/medias");

// const swaggerUi = require("swagger-ui-express");
// const swaggerFile = require("./swagger-output.json");
const bodyParser = require("body-parser");

var app = express();
const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// /* Middlewares */
app.use(bodyParser.json());
// app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/contacts", contactsRouter);
app.use("/listenings", listeningsRouter);
app.use("/pressReviews", pressReviewsRouter);
app.use("/events", eventsRouter);
app.use("/studiedWorks", studiedWorksRouter);
app.use("/news", newsRouter);
app.use("/medias", mediasRouter);

module.exports = app;
