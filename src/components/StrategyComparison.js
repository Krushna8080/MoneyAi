import React, { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, BarChart3, Percent } from 'lucide-react';
import './StrategyComparison.css';

const StrategyComparison = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeframe, setTimeframe] = useState('1y'); // 1m, 3m, 6m, 1y, all

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, timeframe]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {
        startDate,
        endDate,
        timeframe
      };
      const response = await axios.get("http://localhost:5000/api/strategies/compare", { params });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch strategy data");
      console.error("Error fetching comparison data:", err);
    } finally {
      setLoading(false);
    }
  };

  const timeframeOptions = [
    { value: '1m', label: '1M' },
    { value: '3m', label: '3M' },
    { value: '6m', label: '6M' },
    { value: '1y', label: '1Y' },
    { value: 'all', label: 'All' }
  ];

  const getBestStrategy = () => {
    if (!data.length) return null;
    return data.reduce((best, current) => 
      current.ROI > best.ROI ? current : best
    );
  };

  const getWorstStrategy = () => {
    if (!data.length) return null;
    return data.reduce((worst, current) => 
      current.ROI < worst.ROI ? current : worst
    );
  };

  const bestStrategy = getBestStrategy();
  const worstStrategy = getWorstStrategy();

  return (
    <div className="strategy-comparison">
      <div className="comparison-header">
        <div className="title-section">
          <h2>
            <TrendingUp className="header-icon" />
            Strategy Comparison
          </h2>
          <p className="subtitle">Compare performance across different trading strategies</p>
        </div>

        <div className="filters">
          <div className="timeframe-selector">
            {timeframeOptions.map(option => (
              <button
                key={option.value}
                className={`timeframe-btn ${timeframe === option.value ? 'active' : ''}`}
                onClick={() => setTimeframe(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="date-range">
            <Calendar size={18} />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
            <span>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading strategy data...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="performance-overview">
            <div className="strategy-card best">
              <h3>Best Performing Strategy</h3>
              {bestStrategy && (
                <div className="strategy-details">
                  <span className="strategy-name">{bestStrategy.strategy}</span>
                  <div className="metrics">
                    <div className="metric">
                      <ArrowUpRight className="icon positive" />
                      <span className="value positive">+{bestStrategy.ROI}%</span>
                      <span className="label">ROI</span>
                    </div>
                    <div className="metric">
                      <BarChart3 className="icon" />
                      <span className="value">{bestStrategy.CAGR}%</span>
                      <span className="label">CAGR</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="strategy-card worst">
              <h3>Worst Performing Strategy</h3>
              {worstStrategy && (
                <div className="strategy-details">
                  <span className="strategy-name">{worstStrategy.strategy}</span>
                  <div className="metrics">
                    <div className="metric">
                      <ArrowDownRight className="icon negative" />
                      <span className="value negative">{worstStrategy.ROI}%</span>
                      <span className="label">ROI</span>
                    </div>
                    <div className="metric">
                      <Percent className="icon" />
                      <span className="value">{worstStrategy.drawdown}%</span>
                      <span className="label">Drawdown</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Strategy</th>
                  <th>ROI (%)</th>
                  <th>CAGR (%)</th>
                  <th>Drawdown (%)</th>
                  <th>Sharpe Ratio</th>
                  <th>Win Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <tr key={index}>
                    <td className="strategy-cell">{entry.strategy}</td>
                    <td className={`numeric ${entry.ROI >= 0 ? 'positive' : 'negative'}`}>
                      {entry.ROI >= 0 ? '+' : ''}{entry.ROI}%
                    </td>
                    <td className="numeric">{entry.CAGR}%</td>
                    <td className="numeric negative">-{entry.drawdown}%</td>
                    <td className="numeric">{entry.sharpeRatio?.toFixed(2) || 'N/A'}</td>
                    <td className="numeric">{entry.winRate?.toFixed(1) || 'N/A'}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StrategyComparison;