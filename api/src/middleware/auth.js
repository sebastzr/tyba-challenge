const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (token == null) {
    return res
      .status(401)
      .json({ error: "A token is required for authorization" });
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
