const { Router } = require("express");
const { getTransactions } = require("../controllers/transactionController");
const { authenticateToken } = require("../middleware/auth");
const { saveTransaction } = require("../middleware/logTransaction");
const router = Router();

router.get(
  "/api/transactions",
  authenticateToken,
  saveTransaction,
  getTransactions
);

module.exports = router;
