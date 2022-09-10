const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const userValidation = require("../models/userValidation");

const registerUser = async (req, res) => {
  const validation = await userValidation.validate(req.body);
  if (validation.error) return res.status(400).json(validation.error.details);
  try {
    const { username, password } = req.body;
    const newUserData = {
      username,
      password: await bcrypt.hash(password, 10),
    };
    const newUser = await userModel.create(newUserData);
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const validation = await userValidation.validate(req.body);
  if (validation.error) return res.status(400).json(validation.error.details);
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username: username });
    if (user === null) return res.status(400).json({ error: "User not found" });
    if (await bcrypt.compare(password, user.password)) {
      return res.status(200).json(user);
    }
    return res.status(400).json({ error: "Invalid Credentials" });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
