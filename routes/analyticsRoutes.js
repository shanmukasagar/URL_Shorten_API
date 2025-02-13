const express = require("express");
const { fetchUrlAnalytics, getTopicAnalyticsController, getOverallAnalyticsController  } = require("../controllers/analyticsController");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure the user is authenticated
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Get analytics endpoint
router.get("/overall", verifyToken, getOverallAnalyticsController);
router.get("/:alias", fetchUrlAnalytics);
router.get("/topic/:topic", getTopicAnalyticsController);

module.exports = router;
