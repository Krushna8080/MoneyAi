import React from "react";

const Filters = ({ setFilter, applyFilters }) => (
  <div style={{ marginBottom: "16px", display: "flex", gap: "16px" }}>
    <input
      type="date"
      style={{
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
      onChange={(e) => setFilter((prev) => ({ ...prev, dateRange: e.target.value }))}
    />
    <select
      style={{
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
      onChange={(e) => setFilter((prev) => ({ ...prev, sortBy: e.target.value }))}
    >
      <option value="">Sort By</option>
      <option value="profitLoss">Profit/Loss</option>
      <option value="value">Portfolio Value</option>
    </select>
    <button
      style={{
        padding: "8px 16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
      onClick={applyFilters}
    >
      Apply Filters
    </button>
  </div>
);

const staticStockData = [
  { symbol: "AAPL", name: "Apple Inc.", price: 150.25, change: "+1.2%" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 2750.50, change: "-0.8%" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 3400.10, change: "+0.5%" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 299.75, change: "-1.1%" },
];

export { Filters, staticStockData };
