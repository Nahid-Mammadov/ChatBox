const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, required: true },
    email: { type: String, required: true },
    avatar: { type: String }, // ✅ avatar URL saxlayırıq
    userId: { type: String, required: false }, // login olan istifadəçi üçün
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
