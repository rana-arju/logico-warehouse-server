const { generateToken } = require("../helper/token");
const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helper/validation");
const bcrypt = require("bcrypt");
const User = require("../models/User");
exports.register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  if (!validateEmail(email)) {
    return res.status(400).json({
      message: "invalid email address",
    });
  }
  const check = await User.findOne({ email });
  if (check) {
    return res.status(400).json({
      message:
        "This email address already exists,try with a different email address",
    });
  }

  if (!validateLength(last_name, 3, 30)) {
    return res.status(400).json({
      message: "last name must between 3 and 30 characters.",
    });
  }
  if (!validateLength(password, 6, 40)) {
    return res.status(400).json({
      message: "password must be at least 6 characters.",
    });
  }
  const cryptedPassword = await bcrypt.hash(password, 12);
  let tempUsername =
    first_name.split(" ").join("") + last_name.split(" ").join("");
  let newUsername = await validateUsername(tempUsername);
  const user = await new User({
    first_name,
    last_name,
    email,
    password: cryptedPassword,
    username: newUsername,
  }).save();

  const token = generateToken({ id: user._id.toString() }, "7d");
  res.send({
    id: user._id,
    username: user.username,
    picture: user.picture,
    first_name: user.first_name,
    last_name: user.last_name,
    token: token,
    verified: user.verified,
    message: "Register Success!",
  });
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "the email address you entered is not connected to an account",
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Invalid credentials. Please try again",
      });
    }
    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verified: user.verified,
      message: "Login Success!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
