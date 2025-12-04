const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: String,
    senderName: String,
    receiverId: String,
    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", MessageSchema);
