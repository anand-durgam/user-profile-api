const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const messages = require("../utils/messages");
const { validateEmail } = require("../utils/validateEmail");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return validateEmail(value);
      },
      message: (props) => `${props.value} ${messages.error.invalidEmail}`,
    },
  },
  age: {
    type: Number,
    required: true,
    min: [1, `${messages.error.ageValidation}`],
  },
  country: String,
  password: {
    type: String,
    required: true,
    minlength: [8, `${messages.error.passwordLength}`],
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
