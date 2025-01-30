import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import "./Charts.css";

const Charts = ({ data }) => (
  <div className="charts-container">
    <div className="chart-card">
      <div className="chart-header">
        <h2 className="chart-title">Portfolio Growth Over Time</h2>
      </div>
      <div className="chart-content">
        <LineChart width={400} height={300} data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>

    <div className="chart-card">
      <div className="chart-header">
        <h2 className="chart-title">Profit/Loss Per Strategy</h2>
      </div>
      <div className="chart-content">
        <BarChart width={400} height={300} data={data}>
          <XAxis dataKey="strategy" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="profitLoss" fill="#82ca9d" />
        </BarChart>
      </div>
    </div>

    <div className="chart-card">
      <div className="chart-header">
        <h2 className="chart-title">Allocation by Asset Class</h2>
      </div>
      <div className="chart-content">
        <PieChart width={400} height={300}>
          <Pie data={data} dataKey="value" nameKey="strategy" cx="50%" cy="50%" outerRadius={100}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  </div>
);

export default Charts;