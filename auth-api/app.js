const express = require("express");
const jwt = require("jsonwebtoken");
const { connect } = require("./src/db/mongodb");
connect();

const app = express();

app.use(express.json());

// Routes
app.use(require("./src/routes/userRoutes"));

app.listen(3000, () => {
  console.log("Auth API listening on port 3000...");
});
