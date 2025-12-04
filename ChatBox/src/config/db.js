const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://nahidmammadov711:25012004N@nako.dd1xnfj.mongodb.net/chatbox")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));
