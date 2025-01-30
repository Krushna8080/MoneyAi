const express = require("express");
const router = express.Router();

// Helper function to generate mock trade data for 2-3 years
const generateMockTradeData = (years = 2) => {
  const strategies = ["Growth", "Income", "Value"];
  const tradeHistory = {};
  
  strategies.forEach(strategy => {
    tradeHistory[strategy] = [];
    let startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - years);
    
    for (let i = 0; i < years * 12; i++) {
      const tradeDate = new Date(startDate);
      tradeDate.setMonth(tradeDate.getMonth() + i);
      
      tradeHistory[strategy].push({
        date: tradeDate.toISOString().split("T")[0],
        profitLoss: Math.floor(Math.random() * 10000) - 5000 // Random profit/loss between -5000 and 5000
      });
    }
  });
  return tradeHistory;
};

// Generate trade history dynamically for 2-3 years
const tradeHistory = generateMockTradeData(3);

// Helper functions for calculations
const calculateMetrics = (trades, startDate, endDate) => {
  const filteredTrades = trades.filter(trade => {
    const tradeDate = new Date(trade.date);
    return (!startDate || tradeDate >= new Date(startDate)) &&
           (!endDate || tradeDate <= new Date(endDate));
  });

  const initialValue = 100000; // Starting with $100,000
  let currentValue = initialValue;
  let wins = 0;
  let maxValue = initialValue;
  let minValue = initialValue;

  filteredTrades.forEach(trade => {
    const profitLoss = trade.profitLoss;
    currentValue += profitLoss;
    maxValue = Math.max(maxValue, currentValue);
    minValue = Math.min(minValue, currentValue);
    if (profitLoss > 0) wins++;
  });

  const ROI = ((currentValue - initialValue) / initialValue) * 100;
  const years = (new Date(endDate || Date.now()) - new Date(startDate || filteredTrades[0]?.date)) / (365 * 24 * 60 * 60 * 1000);
  const CAGR = years > 0 ? (Math.pow(currentValue / initialValue, 1 / years) - 1) * 100 : 0;
  const drawdown = ((maxValue - minValue) / maxValue) * 100;
  const winRate = (wins / filteredTrades.length) * 100;

  // Calculate Sharpe Ratio
  const returns = filteredTrades.map(trade => trade.profitLoss / currentValue);
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
  const sharpeRatio = stdDev !== 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0; // Annualized

  return {
    ROI: parseFloat(ROI.toFixed(2)),
    CAGR: parseFloat(CAGR.toFixed(2)),
    drawdown: parseFloat(drawdown.toFixed(2)),
    winRate: parseFloat(winRate.toFixed(2)),
    sharpeRatio: parseFloat(sharpeRatio.toFixed(2))
  };
};

router.get("/compare", (req, res) => {
  const { startDate, endDate, timeframe } = req.query;

  // Calculate date range based on timeframe
  let calculatedStartDate = startDate;
  if (!startDate && timeframe) {
    const now = new Date();
    switch (timeframe) {
      case '1m':
        calculatedStartDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3m':
        calculatedStartDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6m':
        calculatedStartDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1y':
        calculatedStartDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case '2y':
        calculatedStartDate = new Date(now.setFullYear(now.getFullYear() - 2));
        break;
      default:
        calculatedStartDate = null;
    }
  }

  // Calculate metrics for each strategy
  const comparisonData = Object.entries(tradeHistory).map(([strategy, trades]) => ({
    strategy,
    ...calculateMetrics(trades, calculatedStartDate, endDate)
  }));

  res.json(comparisonData);
});

module.exports = router;
