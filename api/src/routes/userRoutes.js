const { Router } = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const { saveTransaction } = require("../middleware/logTransaction");
const router = Router();

router.post("/api/register", saveTransaction, registerUser);
router.post("/api/login", saveTransaction, loginUser);

module.exports = router;
