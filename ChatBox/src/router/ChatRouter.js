const express = require("express");
const router = express.Router();
const Controller = require("../controllers/ChatController");

router.get("/messages", Controller.getMessages);

module.exports = router;
