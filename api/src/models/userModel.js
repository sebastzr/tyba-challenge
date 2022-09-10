const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.path("username").validate(async (username) => {
  const usernameCount = await mongoose.models.User.countDocuments({
    username,
  });
  return !usernameCount;
}, "Username `{VALUE}` already taken");

module.exports = mongoose.model("User", userSchema);
