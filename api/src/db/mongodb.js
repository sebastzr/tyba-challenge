const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://mongo:27017/auth");
    console.log(`[MONGODB]: Connected to mongoDB`);
  } catch (error) {
    console.log(`[MONGODB]: ${error.message}`);
  }
}

module.exports = { connect };
