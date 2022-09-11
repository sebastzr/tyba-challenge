const mongoose = require("mongoose");

const authSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Auth", authSchema);
