import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUpDown, Settings, TrendingUp, TrendingDown, RefreshCw, Wallet, ExternalLink, Info, ChevronDown, Zap, BarChart3, Activity } from 'lucide-react';
import './MarketPlace.css';

const Marketplace = () => {
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [priceImpact, setPriceImpact] = useState('0.00');
  const [gasFee, setGasFee] = useState('$12.45');
  
  // Realistic live-updating price data
  const [priceData, setPriceData] = useState({
    ETH: { price: 2456.78, change24h: 2.34, volume: '1.2B' },
    BTC: { price: 43250.12, change24h: -1.23, volume: '2.8B' },
    USDC: { price: 1.00, change24h: 0.01, volume: '890M' },
    USDT: { price: 0.999, change24h: -0.02, volume: '1.5B' },
    UNI: { price: 8.45, change24h: 5.67, volume: '45M' },
    MATIC: { price: 0.85, change24h: 3.21, volume: '120M' }
  });

  // Realistic chart data with more points
  const [chartData, setChartData] = useState([]);
  const [selectedChart, setSelectedChart] = useState('ETH');
  const [walletConnected, setWalletConnected] = useState(false);

  const tokens = [
    { symbol: 'ETH', name: 'Ethereum', logo: '⟠', color: '#627EEA' },
    { symbol: 'BTC', name: 'Bitcoin', logo: '₿', color: '#F7931A' },
    { symbol: 'USDC', name: 'USD Coin', logo: '💲', color: '#2775CA' },
    { symbol: 'USDT', name: 'Tether', logo: '₮', color: '#26A17B' },
    { symbol: 'UNI', name: 'Uniswap', logo: '🦄', color: '#FF007A' },
    { symbol: 'MATIC', name: 'Polygon', logo: '🔷', color: '#8247E5' }
  ];

  // Generate realistic chart data
  useEffect(() => {
    const generateChartData = () => {
      const data = [];
      const basePrice = priceData[selectedChart]?.price || 100;
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const randomChange = (Math.random() - 0.5) * 0.05; // ±2.5% change
        const price = basePrice * (1 + randomChange * (i / 24));
        
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          price: Number(price.toFixed(2)),
          volume: Math.random() * 1000000
        });
      }
      return data;
    };
    
    setChartData(generateChartData());
  }, [selectedChart, priceData]);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(token => {
          const change = (Math.random() - 0.5) * 0.02; // ±1% change
          updated[token].price *= (1 + change);
          updated[token].change24h += change * 100;
        });
        return updated;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Realistic exchange rate calculation
  const calculateExchangeRate = (from, to, amount) => {
    if (!amount || from === to) return '';
    
    const fromPrice = priceData[from]?.price || 1;
    const toPrice = priceData[to]?.price || 1;
    const rate = fromPrice / toPrice;
    const result = (parseFloat(amount) * rate).toFixed(6);
    
    // Calculate price impact (higher for larger trades)
    const impact = Math.min(parseFloat(amount) * 0.001, 5);
    setPriceImpact(impact.toFixed(2));
    
    return result;
  };

  useEffect(() => {
    if (fromAmount && fromToken !== toToken) {
      const result = calculateExchangeRate(fromToken, toToken, fromAmount);
      setToAmount(result);
    }
  }, [fromAmount, fromToken, toToken, priceData]);

  const swapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };

  const handleSwap = async () => {
    setIsLoading(true);
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(`✅ Successfully swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`);
    setIsLoading(false);
    setFromAmount('');
    setToAmount('');
  };

  const connectWallet = () => {
    setWalletConnected(!walletConnected);
  };

  // Mini trend chart component
  const MiniTrendChart = ({ data, isPositive, color }) => (
    <div className="mini-chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.slice(-8)}>
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={isPositive ? '#10B981' : '#EF4444'} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="marketplace-container">
      {/* Animated background */}
      <div className="background-animation"></div>
      
      {/* Header */}
      <nav className="main-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-section">
              <div className="logo-icon">⚡</div>
              <h1 className="logo-text">
                DeX Protocol
              </h1>
            </div>
            <nav className="nav-links">
              <a href="#" className="nav-link active">Swap</a>
              <a href="#" className="nav-link">Pool</a>
              <a href="#" className="nav-link">Analytics</a>
              <a href="#" className="nav-link">Portfolio</a>
            </nav>
          </div>
          <div className="header-right">
            <div className="network-indicator">
              <div className="network-dot"></div>
              <span>Ethereum</span>
            </div>
            <button
              onClick={connectWallet}
              className={`wallet-btn ${walletConnected ? 'connected' : ''}`}
            >
              <Wallet className="wallet-icon" />
              {walletConnected ? '0x1234...5678' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </nav>

      <div className="main-content">
        {/* Enhanced Price Ticker */}
        <div className="price-ticker-container">
          <div className="ticker-header">
            <div className="ticker-title">
              <Activity className="ticker-icon" />
              <span>Live Market</span>
            </div>
            <div className="ticker-stats">
              <span>24h Volume: $4.2B</span>
              <span>Total TVL: $12.8B</span>
            </div>
          </div>
          <div className="price-ticker">
            {tokens.map(token => (
              <div 
                key={token.symbol}
                className={`ticker-item ${selectedChart === token.symbol ? 'active' : ''}`}
                onClick={() => setSelectedChart(token.symbol)}
              >
                <div className="ticker-main">
                  <div className="token-info">
                    <span className="token-logo">{token.logo}</span>
                    <div className="token-details">
                      <span className="token-symbol">{token.symbol}</span>
                      <span className="token-name">{token.name}</span>
                    </div>
                  </div>
                  <div className="price-info">
                    <span className="token-price">${priceData[token.symbol]?.price.toLocaleString()}</span>
                    <div className={`price-change ${priceData[token.symbol]?.change24h >= 0 ? 'positive' : 'negative'}`}>
                      {priceData[token.symbol]?.change24h >= 0 ? <TrendingUp className="trend-icon" /> : <TrendingDown className="trend-icon" />}
                      {priceData[token.symbol]?.change24h >= 0 ? '+' : ''}{priceData[token.symbol]?.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="ticker-chart">
                  <MiniTrendChart 
                    data={chartData} 
                    isPositive={priceData[token.symbol]?.change24h >= 0}
                    color={token.color}
                  />
                </div>
                <div className="ticker-volume">
                  <span>Vol: {priceData[token.symbol]?.volume}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-grid">
          {/* Enhanced Chart Section */}
          <div className="chart-section">
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title">
                  <div className="selected-token">
                    <span className="selected-logo">{tokens.find(t => t.symbol === selectedChart)?.logo}</span>
                    <div className="selected-info">
                      <h2 className="pair-name">{selectedChart}/USD</h2>
                      <div className="price-details">
                        <span className="current-price">${priceData[selectedChart]?.price.toLocaleString()}</span>
                        <span className={`price-change-badge ${priceData[selectedChart]?.change24h >= 0 ? 'positive' : 'negative'}`}>
                          {priceData[selectedChart]?.change24h >= 0 ? '+' : ''}{priceData[selectedChart]?.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="chart-stats">
                    <div className="stat-item">
                      <span className="stat-label">24h High</span>
                      <span className="stat-value">${(priceData[selectedChart]?.price * 1.05).toFixed(2)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">24h Low</span>
                      <span className="stat-value">${(priceData[selectedChart]?.price * 0.95).toFixed(2)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Volume</span>
                      <span className="stat-value">{priceData[selectedChart]?.volume}</span>
                    </div>
                  </div>
                </div>
                <div className="chart-controls">
                  <div className="time-selector">
                    <button className="time-btn active">24H</button>
                    <button className="time-btn">7D</button>
                    <button className="time-btn">30D</button>
                    <button className="time-btn">1Y</button>
                  </div>
                  <button className="refresh-btn">
                    <RefreshCw className="refresh-icon" />
                  </button>
                </div>
              </div>
              
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" opacity={0.3} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#718096"
                      fontSize={12}
                      tick={{ fill: '#718096' }}
                    />
                    <YAxis 
                      stroke="#718096"
                      fontSize={12}
                      tick={{ fill: '#718096' }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1A202C',
                        border: '1px solid #4A5568',
                        borderRadius: '12px',
                        color: '#F7FAFC',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                      }}
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#6366F1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Enhanced Swap Interface */}
          <div className="swap-section">
            <div className="swap-container">
              <div className="swap-header">
                <h2 className="swap-title">
                  <Zap className="swap-icon" />
                  Instant Swap
                </h2>
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="settings-btn"
                >
                  <Settings className="settings-icon" />
                </button>
              </div>

              {showSettings && (
                <div className="settings-panel">
                  <div className="settings-group">
                    <label className="settings-label">
                      Slippage Tolerance
                    </label>
                    <div className="slippage-options">
                      {['0.1', '0.5', '1.0'].map(val => (
                        <button
                          key={val}
                          onClick={() => setSlippage(val)}
                          className={`slippage-btn ${slippage === val ? 'active' : ''}`}
                        >
                          {val}%
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="settings-info">
                    <div className="info-row">
                      <span>Gas Fee:</span>
                      <span>{gasFee}</span>
                    </div>
                    <div className="info-row">
                      <span>Network:</span>
                      <span>Ethereum</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="swap-form">
                {/* From Token */}
                <div className="token-input from-token">
                  <div className="input-header">
                    <label className="input-label">From</label>
                    <span className="balance">Balance: 12.5456</span>
                  </div>
                  <div className="input-content">
                    <div className="token-selector">
                      <select
                        value={fromToken}
                        onChange={(e) => setFromToken(e.target.value)}
                        className="token-select"
                      >
                        {tokens.map(token => (
                          <option key={token.symbol} value={token.symbol}>
                            {token.logo} {token.symbol}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="select-icon" />
                    </div>
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                      className="amount-input"
                    />
                  </div>
                  <div className="input-footer">
                    <span className="usd-value">
                      ≈ ${fromAmount ? (parseFloat(fromAmount) * priceData[fromToken].price).toLocaleString() : '0.00'}
                    </span>
                    <button className="max-btn">MAX</button>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="swap-divider">
                  <button
                    onClick={swapTokens}
                    className="swap-arrow-btn"
                  >
                    <ArrowUpDown className="swap-arrow-icon" />
                  </button>
                </div>

                {/* To Token */}
                <div className="token-input to-token">
                  <div className="input-header">
                    <label className="input-label">To</label>
                    <span className="balance">Balance: 1,234.56</span>
                  </div>
                  <div className="input-content">
                    <div className="token-selector">
                      <select
                        value={toToken}
                        onChange={(e) => setToToken(e.target.value)}
                        className="token-select"
                      >
                        {tokens.map(token => (
                          <option key={token.symbol} value={token.symbol}>
                            {token.logo} {token.symbol}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="select-icon" />
                    </div>
                    <input
                      type="number"
                      value={toAmount}
                      readOnly
                      placeholder="0.0"
                      className="amount-input"
                    />
                  </div>
                  <div className="input-footer">
                    <span className="usd-value">
                      ≈ ${toAmount ? (parseFloat(toAmount) * priceData[toToken].price).toLocaleString() : '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Swap Details */}
              {fromAmount && toAmount && (
                <div className="swap-details">
                  <div className="detail-row">
                    <span>Rate</span>
                    <span>1 {fromToken} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(4)} {toToken}</span>
                  </div>
                  <div className="detail-row">
                    <span>Price Impact</span>
                    <span className={parseFloat(priceImpact) > 3 ? 'high-impact' : 'low-impact'}>
                      {priceImpact}%
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Network Fee</span>
                    <span>{gasFee}</span>
                  </div>
                  <div className="detail-row">
                    <span>Minimum Received</span>
                    <span>{(parseFloat(toAmount) * (1 - parseFloat(slippage) / 100)).toFixed(6)} {toToken}</span>
                  </div>
                </div>
              )}

              {/* Enhanced Swap Button */}
              <button
                onClick={handleSwap}
                disabled={!walletConnected || !fromAmount || !toAmount || fromAmount === '0' || isLoading}
                className="main-swap-btn"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="btn-icon spinning" />
                    <span>Swapping...</span>
                  </>
                ) : !walletConnected ? (
                  <>
                    <Wallet className="btn-icon" />
                    <span>Connect Wallet</span>
                  </>
                ) : !fromAmount || fromAmount === '0' ? (
                  <span>Enter Amount</span>
                ) : (
                  <>
                    <Zap className="btn-icon" />
                    <span>Swap Tokens</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;