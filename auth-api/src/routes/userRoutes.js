const { Router } = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const router = Router();

router.post("/api/register", registerUser);
router.post("/api/login", loginUser);

module.exports = router;
