const express = require("express");
const router = express.Router();
const financialData = require("../data/financialData.json");

// Get Portfolio Performance
router.get("/portfolio", (req, res) => {
  res.json(financialData.portfolioPerformance);
});

// Get Portfolio Allocation
router.get("/allocation", (req, res) => {
  res.json(financialData.allocation);
});

// Get Recent Trades
router.get("/trades", (req, res) => {
  res.json(financialData.recentTrades);
});

module.exports = router;
