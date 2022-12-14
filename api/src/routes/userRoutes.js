const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
const { saveTransaction } = require("../middleware/logTransaction");
const router = Router();

router.post("/api/register", saveTransaction, registerUser);
router.post("/api/login", saveTransaction, loginUser);
router.post("/api/logout", authenticateToken, logoutUser);

module.exports = router;
