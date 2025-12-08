const express = require("express");
const router = express.Router();
const { addReview, getReviews } = require("../controllers/ReviewController");

router.post("/add", addReview);
router.get("/all", getReviews);

module.exports = router;
