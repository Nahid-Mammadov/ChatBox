const Message = require("../models/MessageModel");

const getMessages = async (req, res) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) {
    return res.status(400).send({ message: "Missing user IDs" });
  }

  const msgs = await Message.find({
    $or: [
      { senderId: user1, receiverId: user2 },
      { senderId: user2, receiverId: user1 },
    ],
  }).sort({ createdAt: 1 });

  res.send(msgs);
};

module.exports = { getMessages };
