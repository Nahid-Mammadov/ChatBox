const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://nahidmammadov711:25012004N@nako.dd1xnfj.mongodb.net/chatbox?retryWrites=true&w=majority"
  )
  .then(() => console.log("connected mongodb"))
  .catch((err) => console.log("err", err));
