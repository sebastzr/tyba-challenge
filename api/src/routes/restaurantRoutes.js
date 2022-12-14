const { Router } = require("express");
const router = Router();
const { authenticateToken } = require("../middleware/auth");
const { saveTransaction } = require("../middleware/logTransaction");

const { searchRestaurants } = require("../controllers/restaurantController");

router.get(
  "/api/restaurants",
  authenticateToken,
  saveTransaction,
  searchRestaurants
);

module.exports = router;
