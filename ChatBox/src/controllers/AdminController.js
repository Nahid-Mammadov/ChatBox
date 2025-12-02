const Model = require("../models/AdminModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const uuidv4 = require("uuidv4").uuid;

// ========================== GET ALL ==========================
const getall = async (req, res) => {
  const posts = await Model.find();
  res.send(posts);
};

// ========================== GET BY ID ==========================
const getById = async (req, res) => {
  try {
    const user = await Model.findById(req.params.id);
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user);
  } catch {
    res.status(500).send({ message: "Invalid ID format" });
  }
};

// ========================== DELETE ==========================
const deleteByiD = async (req, res) => {
  try {
    const deleted = await Model.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send({ message: "User not found" });

    res.send({ message: "User deleted successfully" });
  } catch {
    res.status(500).send({ message: "Error deleting user" });
  }
};

// ========================== CREATE USER ==========================
const postOne = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    const exists = await Model.findOne({ email });
    if (exists) return res.status(400).send({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await Model.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    res.send({ message: "User created successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error creating user" });
  }
};

// ========================== PATCH USER ==========================
const patchOne = async (req, res) => {
  const update = { ...req.body };

  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }

  try {
    const updated = await Model.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!updated)
      return res.status(404).send({ message: "User not found" });

    res.send(updated);
  } catch {
    res.status(500).send("Error updating user");
  }
};

// ========================== LOGIN ==========================
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Model.findOne({ email });
  if (!user) return res.status(404).send({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send({ message: "Invalid password" });

  res.send({ message: "Login successful", user });
};

// ========================== REGISTER ==========================
const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  const existing = await Model.findOne({ email });
  if (existing) return res.status(400).send({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new Model({
    id: uuidv4(), // 🔥 avtomatik ID
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  res.send({
    message: "Registration successful",
  });
};

// ========================== FORGOT PASSWORD ==========================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Model.findOne({ email });
    if (!user) return res.status(404).send({ message: "No user found" });

    const code = crypto.randomInt(100000, 999999).toString();

    user.verificationCode = code;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
    });

    res.send({ message: "Verification code sent to email" });
  } catch (err) {
    console.log("EMAIL ERROR:", err);
    res.status(500).send({ message: "Email could not be sent" });
  }
};

// ========================== VERIFY CODE ==========================
const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  const user = await Model.findOne({ email });
  if (!user) return res.status(404).send({ message: "User not found" });

  if (user.verificationCode !== code)
    return res.status(400).send({ message: "Invalid code" });

  res.send({
    message: "Code verified",
    userId: user._id, // 🔥 Artıq həmişə olacaq
  });
};

// ========================== RESET PASSWORD ==========================
const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  const hashed = await bcrypt.hash(newPassword, 10);

  const updated = await Model.findByIdAndUpdate(
    id,
    { password: hashed, verificationCode: null },
    { new: true }
  );

  if (!updated) return res.status(404).send({ message: "User not found" });

  res.send({ message: "Password reset successful" });
};

module.exports = {
  getall,
  getById,
  deleteByiD,
  postOne,
  patchOne,
  login,
  register,
  forgotPassword,
  verifyCode,
  resetPassword,
};
