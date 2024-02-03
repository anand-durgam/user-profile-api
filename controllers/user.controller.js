const User = require("../models/user.model");
const { getUserStatistics } = require("../services/userStatsService");
const bcrypt = require("bcrypt");
const messages = require("../utils/messages");
const { validateEmail } = require("../utils/validateEmail");

const isEmailUnique = async (email) => {
  const existingUser = await User.findOne({ email });
  return !existingUser;
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password from the response
    // Fetch additional users statistics
    const additionalStats = await getUserStatistics();

    const responseData = {
      users: users,
      statistics: additionalStats,
    };

    res.status(200).json({
      status: "success",
      data: responseData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, age, country, password } = req.body;

    // Validate email uniqueness
    const isUnique = await isEmailUnique(email);
    if (!isUnique) {
      return res
        .status(400)
        .json({ status: "error", message: messages.error.emailInUse });
    }

    // Convert to Hash password before saving
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, age, country, password });
    await user.save();
    res.status(201).json({
      status: "success",
      message: messages.success.userCreated,
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email uniqueness
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return res
        .status(400)
        .json({ status: "error", message: messages.error.invalidEmail });
    }

    const isUnique = await isEmailUnique(email);
    if (!isUnique) {
      return res
        .status(400)
        .json({ status: "error", message: messages.error.emailInUse });
    }

    await User.findByIdAndUpdate(req.params.id, req.body);
    res
      .status(200)
      .json({ status: "success", message: messages.success.userUpdated });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ status: "success", message: messages.success.userDeleted });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
