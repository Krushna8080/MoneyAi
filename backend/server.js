const express = require("express");
const cors = require("cors");
const financeRoutes = require("./routes/financeRoutes");
const strategyRoutes = require("./routes/strategyRoutes")
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", financeRoutes);
app.use("/api/strategies", strategyRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
