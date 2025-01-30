import React, { useState, useEffect } from "react";
import { ChevronRight, Search, Bell, Moon, Sun, ArrowUp, ArrowDown, Menu, X, ChevronLeft, TrendingUp } from 'lucide-react';
import Charts from "./components/Charts";
import MetricsTable from "./components/MetricsTable";
import MarketUpdates from "./components/MarketUpdates";
import StrategyComparison from "./components/StrategyComparison";
import axios from "axios";
import './App.css';

// Custom hook for simulating real-time price updates
const useMarketData = (initialPrice, volatility = 0.002) => {
  const [price, setPrice] = React.useState(initialPrice);
  const [change, setChange] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const randomChange = (Math.random() - 0.5) * 2 * volatility * initialPrice;
      const newPrice = price + randomChange;
      setPrice(newPrice);
      setChange(((newPrice - initialPrice) / initialPrice) * 100);
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [price, initialPrice, volatility]);

  return { price, change };
};

const StockCard = ({ icon, name, basePrice, volatility }) => {
  const { price, change } = useMarketData(basePrice, volatility);
  
  // Generate dynamic trend path based on price changes
  const generateTrendPath = () => {
    const points = Array.from({ length: 10 }, () => Math.random() * 20);
    return `M 0 ${points[0]} ` + points.map((p, i) => `L ${i * 11} ${p}`).join(' ');
  };

  return (
    <div className="stock-card">
      <div className="stock-card-header">
        {icon}
        <span className="stock-name">{name}</span>
      </div>
      <div className="stock-card-content">
        <div className="stock-info">
          <div className="info-label">Current Price</div>
          <div className="info-value">₹{price.toFixed(2)}</div>
        </div>
        <div className="stock-return">
          <div className="info-label">Change</div>
          <div className={`return-value ${change >= 0 ? 'positive' : 'negative'}`}>
            {change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span>{Math.abs(change).toFixed(2)}%</span>
          </div>
        </div>
        <div className="trend-chart">
          <svg viewBox="0 0 100 20">
            <path d={generateTrendPath()} stroke={change >= 0 ? '#10b981' : '#ef4444'} fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [portfolioData, setPortfolioData] = useState([]);
  const [allocationData, setAllocationData] = useState([]);
  const [tradesData, setTradesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState({ dateRange: "", sortBy: "" });
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const portfolioResponse = await axios.get("http://https://moneyai.onrender.com/api/portfolio");
        const allocationResponse = await axios.get("http://https://moneyai.onrender.com/api/allocation");
        const tradesResponse = await axios.get("http://https://moneyai.onrender.com/api/trades");

        setPortfolioData(portfolioResponse.data);
        setFilteredData(portfolioResponse.data);
        setAllocationData(allocationResponse.data);
        setTradesData(tradesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const marketData = [
    {
      name: 'NIFTY 50',
      icon: <TrendingUp size={32} className="market-icon nifty" />,
      basePrice: 22150.75,
      volatility: 0.001
    },
    {
      name: 'BANK NIFTY',
      icon: <TrendingUp size={32} className="market-icon banknifty" />,
      basePrice: 46780.50,
      volatility: 0.0015
    },
    {
      name: 'GOLD',
      icon: <TrendingUp size={32} className="market-icon gold" />,
      basePrice: 62450.25,
      volatility: 0.0008
    },
    {
      name: 'SILVER',
      icon: <TrendingUp size={32} className="market-icon silver" />,
      basePrice: 72180.90,
      volatility: 0.002
    }
  ];

  const renderHeroSection = () => (
    <div className="hero-section">
      <div className="hero-pattern"></div>
      <div className="hero-content">
        <h1>Welcome to Money.ai</h1>
        <p>Harness the power of AI to make smarter investment decisions. Get real-time insights, advanced analytics, and personalized recommendations.</p>
        <button className="cta-button">Get Started</button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            {renderHeroSection()}
            <div className="stock-grid">
              {marketData.map((market, index) => (
                <StockCard key={index} {...market} />
              ))}
            </div>
            <div className="summary-grid">
              <div className="investment-summary">
                <div className="card-header">
                  <h2>Total Investment</h2>
                  <select className="period-select">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="metrics-grid">
                  <div className="metric">
                    <div className="metric-label">Invested Value</div>
                    <div className="metric-value">₹1,279.95</div>
                    <div className="metric-change positive">
                      <ArrowUp size={16} /> 1.22%
                    </div>
                  </div>
                  <div className="metric">
                    <div className="metric-label">Total Returns</div>
                    <div className="metric-value">₹22,543.87</div>
                    <div className="metric-change positive">
                      <ArrowUp size={16} /> 10.14%
                    </div>
                  </div>
                </div>
                <div className="chart-container"></div>
              </div>

              <div className="stocks-summary">
                <div className="card-header">
                  <h2>Market Overview</h2>
                  <select className="period-select">
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Daily</option>
                  </select>
                </div>
                <div className="stocks-list">
                  {marketData.map((market, index) => (
                    <div key={index} className="stock-item">
                      <div className="stock-item-info">
                        {market.icon}
                        <div className="stock-item-details">
                          <div className="stock-item-name">{market.name}</div>
                          <div className="stock-item-shares">Live Market</div>
                        </div>
                      </div>
                      <div className="stock-item-values">
                        <div className="stock-item-price">₹{market.basePrice.toFixed(2)}</div>
                        <div className="stock-item-change positive">+0.00%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      case 'filters':
        return <div>Filters Component</div>;
      case 'charts':
        return <Charts data={filteredData} />;
      case 'metrics':
        return <MetricsTable data={filteredData} />;
      case 'strategy':
        return <StrategyComparison />;
      case 'updates':
        return <MarketUpdates trades={tradesData} allocation={allocationData} />;
      default:
        return null;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="logo-container">
              {!sidebarCollapsed && (
                <h1 className="logo-text">
                  <span className="text-gradient">Money</span>
                  <span className="text-gradient-alt">.ai</span>
                </h1>
              )}
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
                className="collapse-button"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {sidebarCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
              </button>
            </div>
          </div>
          <nav className="sidebar-nav">
            {['dashboard', 'filters', 'charts', 'metrics', 'strategy', 'updates'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`nav-item ${activeSection === section ? 'active' : ''}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <header className="main-header">
          <div className="header-left">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
              className="menu-button"
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? <Menu size={24} /> : <X size={24} />}
            </button>
            <h1 className="header-title">
              <span className="text-gradient">Money</span>
              <span className="text-gradient-alt">.ai</span>
            </h1>
          </div>
          <div className="header-right">
            <div className="search-container">
              <Search className="search-icon" />
              <input type="text" placeholder="Search markets, news, analysis..." className="search-input" />
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="theme-button" aria-label="Toggle theme">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="notification-button" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="auth-buttons">
              <button className="sign-in">Sign In</button>
              <button className="sign-up">Sign Up</button>
            </div>
          </div>
        </header>

        <div className="main-container">
          {renderContent()}
        </div>

        <footer className="main-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Money.ai</h3>
              <p>Making financial decisions smarter with AI-powered insights.</p>
            </div>
            <div className="footer-section">
              <h4>Products</h4>
              <ul>
                <li><a href="#">Analytics</a></li>
                <li><a href="#">Portfolio Management</a></li>
                <li><a href="#">Risk Assessment</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API Reference</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Money.ai. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
