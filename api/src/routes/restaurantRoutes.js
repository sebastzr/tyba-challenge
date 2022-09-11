const { Router } = require("express");
const router = Router();
const { authenticateToken } = require("../middleware/auth");

const { searchRestaurants } = require("../controllers/restaurantController");

router.get("/api/restaurants", authenticateToken, searchRestaurants);

module.exports = router;
