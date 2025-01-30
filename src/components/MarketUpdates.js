import React, { useState } from "react";
import { TrendingUp, PieChart, ArrowUpRight, ArrowDownRight, Calendar, DollarSign, TrendingDown, BarChart } from 'lucide-react';
import './MarketUpdates.css';

const MarketUpdates = ({ trades, allocation }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter trades based on date range
  const filteredTrades = trades.filter(trade => {
    if (!startDate && !endDate) return true;
    const tradeDate = new Date(trade.date);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    return tradeDate >= start && tradeDate <= end;
  });

  // Calculate allocation for the filtered period
  const filteredAllocation = allocation.map(asset => {
    const relevantTrades = filteredTrades.filter(trade => trade.symbol === asset.assetClass);
    const tradeImpact = relevantTrades.reduce((sum, trade) => {
      return sum + (trade.action === 'BUY' ? trade.price * trade.quantity : -trade.price * trade.quantity);
    }, 0);
    return {
      ...asset,
      value: asset.value + tradeImpact,
      trades: relevantTrades.length,
      performance: ((asset.value + tradeImpact - asset.value) / asset.value) * 100
    };
  });

  const totalValue = filteredAllocation.reduce((sum, asset) => sum + asset.value, 0);
  const totalTrades = filteredTrades.length;
  const topPerformer = [...filteredAllocation].sort((a, b) => b.performance - a.performance)[0];
  const worstPerformer = [...filteredAllocation].sort((a, b) => a.performance - b.performance)[0];

  return (
    <div className="market-updates-container">
      <div className="market-header">
        <h2 className="market-title">
          <TrendingUp className="header-icon" size={24} />
          Market Updates
        </h2>
        <div className="date-filter">
          <Calendar className="calendar-icon" size={20} />
          <input
            type="date"
            className="date-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <span className="date-separator">to</span>
          <input
            type="date"
            className="date-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </div>
      </div>

      <div className="market-grid">
        <div className="allocation-section">
          <div className="allocation-header">
            <h3>
              <PieChart className="card-icon" size={20} />
              Portfolio Allocation
            </h3>
            <div className="portfolio-stats">
              <div className="stat-item">
                <DollarSign size={16} />
                <span className="stat-label">Total Value</span>
                <span className="stat-value">${totalValue.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <BarChart size={16} />
                <span className="stat-label">Total Trades</span>
                <span className="stat-value">{totalTrades}</span>
              </div>
            </div>
          </div>

          <div className="performance-summary">
            <div className="performance-card top-performer">
              <h4>Top Performer</h4>
              <div className="performer-details">
                <span className="performer-asset">{topPerformer?.assetClass}</span>
                <span className="performer-value positive">
                  <ArrowUpRight size={16} />
                  {topPerformer?.performance.toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="performance-card worst-performer">
              <h4>Worst Performer</h4>
              <div className="performer-details">
                <span className="performer-asset">{worstPerformer?.assetClass}</span>
                <span className="performer-value negative">
                  <TrendingDown size={16} />
                  {worstPerformer?.performance.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <div className="allocation-list">
            {filteredAllocation.map((asset, index) => (
              <div key={index} className="allocation-item">
                <div className="asset-info">
                  <div className="asset-header">
                    <span className="asset-class">{asset.assetClass}</span>
                    <span className={`asset-performance ${asset.performance >= 0 ? 'positive' : 'negative'}`}>
                      {asset.performance >= 0 ? <ArrowUpRight size={14} /> : <TrendingDown size={14} />}
                      {asset.performance.toFixed(2)}%
                    </span>
                  </div>
                  <div className="asset-value">
                    <span className="value">${asset.value.toLocaleString()}</span>
                    <span className="percentage">
                      {((asset.value / totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <span className="trade-count">{asset.trades} trades</span>
                </div>
                <div className="allocation-bar-container">
                  <div 
                    className="allocation-bar"
                    style={{ width: `${(asset.value / totalValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="trades-card">
          <h3>
            <TrendingUp className="card-icon" size={20} />
            Recent Trades
          </h3>
          <div className="trades-list">
            {filteredTrades.map((trade, index) => (
              <div key={index} className="trade-item">
                <div className="trade-symbol">{trade.symbol}</div>
                <div className="trade-details">
                  <span className={`trade-action ${trade.action.toLowerCase()}`}>
                    {trade.action === 'BUY' ? (
                      <ArrowUpRight size={16} className="trade-icon" />
                    ) : (
                      <ArrowDownRight size={16} className="trade-icon" />
                    )}
                    {trade.action}
                  </span>
                  <span className="trade-quantity">{trade.quantity} shares</span>
                  <span className="trade-price">${trade.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketUpdates;