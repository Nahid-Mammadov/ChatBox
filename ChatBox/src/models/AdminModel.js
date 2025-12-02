const mongoose = require("mongoose");

const schema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  password: String,
  verificationCode: String,
});

const Model = mongoose.model("admins", schema);
module.exports = Model;
