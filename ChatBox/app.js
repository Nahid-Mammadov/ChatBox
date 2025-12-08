const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./src/config/db");

const adminRouter = require("./src/router/AdminRouter");
const chatRouter = require("./src/router/ChatRouter");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/api", adminRouter);
app.use("/api/chat", chatRouter);

app.use("/api/reviews", require("./src/router/reviewRoutes"));

app.get("/", (req, res) => {
  res.send("API working...");
});

module.exports = app;
