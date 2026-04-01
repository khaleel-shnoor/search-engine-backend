const express = require("express");
const router = express.Router();
const {
  searchDocuments,
  getSearchHistory,
  getSearchAnalytics,
  getSuggestions,
} = require("../controllers/searchController");

router.get("/", searchDocuments);
router.get("/history", getSearchHistory);
router.get("/analytics", getSearchAnalytics);
router.get("/suggestions", getSuggestions);

module.exports = router;