const jwt = require("jsonwebtoken");
const authModel = require("../models/authModel");

const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (token == null) {
    return res
      .status(401)
      .json({ error: "A token is required for authorization" });
  }

  const usedToken = await authModel.findOne({ token: token });

  if (usedToken) {
    return res.status(400).json({ error: "Token is no longer valid (logout)" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token is no longer valid" });
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
};
