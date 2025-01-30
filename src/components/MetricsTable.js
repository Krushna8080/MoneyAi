import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import './MetricsTable.css';

const MetricsTable = ({ data }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const calculateROI = (startValue, endValue) => ((endValue - startValue) / startValue) * 100;
  const calculateCAGR = (startValue, endValue, years) => (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
  const calculateDrawdown = (values) => {
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    return ((maxValue - minValue) / maxValue) * 100;
  };

  const filteredData = data.filter((entry) => {
    if (!startDate && !endDate) return true;
    const entryDate = new Date(entry.date);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();
    return entryDate >= start && entryDate <= end;
  });

  const startValue = filteredData[0]?.value || 0;
  const endValue = filteredData[filteredData.length - 1]?.value || 0;
  const years = filteredData.length / 365; // Assuming one data point per day
  const values = filteredData.map((entry) => entry.value);

  const roi = calculateROI(startValue, endValue);
  const cagr = calculateCAGR(startValue, endValue, years);
  const drawdown = calculateDrawdown(values);

  return (
    <div className="metrics-container">
      <div className="metrics-header">
        <h2 className="metrics-title">Portfolio Performance Metrics</h2>
        <div className="filter-section">
          <Calendar className="text-gray-400" size={20} />
          <input
            type="date"
            className="date-picker"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            className="date-picker"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </div>
      </div>

      <div className="metrics-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Portfolio Value</th>
              <th>Profit/Loss</th>
              <th>Win Rate</th>
              <th>Strategy</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>${entry.value.toLocaleString()}</td>
                <td className={entry.profitLoss >= 0 ? 'positive' : 'negative'}>
                  ${Math.abs(entry.profitLoss).toLocaleString()}
                </td>
                <td>{entry.winRate}%</td>
                <td>{entry.strategy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="performance-summary">
        <div className="metric-card">
          <h3>Return on Investment</h3>
          <p className={`metric-value ${roi >= 0 ? 'positive' : 'negative'}`}>
            {roi.toFixed(2)}%
          </p>
        </div>
        <div className="metric-card">
          <h3>Compound Annual Growth Rate</h3>
          <p className={`metric-value ${cagr >= 0 ? 'positive' : 'negative'}`}>
            {cagr.toFixed(2)}%
          </p>
        </div>
        <div className="metric-card">
          <h3>Maximum Drawdown</h3>
          <p className="metric-value negative">
            {drawdown.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetricsTable;