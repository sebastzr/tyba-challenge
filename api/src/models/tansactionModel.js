const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
  },
  body: {
    type: Object,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
