require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const authController = require("./controller/authController");
const adminController = require("./controller/adminController");
const userController = require("./controller/userController");
const systemController = require("./controller/systemController");
const requestResponseHandler = require("./service/requestResponseHandler");
const cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(
  require("express-session")({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Everything is working fine" });
});
app.use("/online-quiz", authController);
app.use("/online-quiz/admin", adminController);
app.use("/online-quiz/user", userController);
app.use("/online-quiz/system", systemController);
app.use(requestResponseHandler.handleResponse);
app.use(requestResponseHandler.handleError);
app.listen(process.env.SERVER_PORT, () => {
  console.log("THE SERVER IS LISTENING ON PORT 3000 ( ONLINE-QUIZ )");
});
