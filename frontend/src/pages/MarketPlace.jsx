import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ArrowUpDown, Settings, TrendingUp, TrendingDown, RefreshCw, Wallet, ExternalLink, Info, ChevronDown, Zap } from 'lucide-react';

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
    { symbol: 'ETH', name: 'Ethereum', logo: '⟠' },
    { symbol: 'BTC', name: 'Bitcoin', logo: '₿' },
    { symbol: 'USDC', name: 'USD Coin', logo: '💲' },
    { symbol: 'USDT', name: 'Tether', logo: '₮' },
    { symbol: 'UNI', name: 'Uniswap', logo: '🦄' },
    { symbol: 'MATIC', name: 'Polygon', logo: '🔷' }
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                DeX Protocol
              </h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-white font-medium">Swap</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Pool</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Analytics</a>
              </nav>
            </div>
            <button
              onClick={connectWallet}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                walletConnected 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Wallet className="w-4 h-4 inline mr-2" />
              {walletConnected ? '0x1234...5678' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Price Ticker */}
        <div className="mb-8 overflow-hidden">
          <div className="flex space-x-8 animate-scroll">
            {tokens.map(token => (
              <div 
                key={token.symbol}
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-800/30 p-3 rounded-lg transition-colors"
                onClick={() => setSelectedChart(token.symbol)}
              >
                <span className="text-2xl">{token.logo}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{token.symbol}</span>
                    <span className="text-gray-400 text-sm">${priceData[token.symbol]?.price.toLocaleString()}</span>
                  </div>
                  <div className={`text-sm flex items-center ${
                    priceData[token.symbol]?.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {priceData[token.symbol]?.change24h >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {priceData[token.symbol]?.change24h >= 0 ? '+' : ''}{priceData[token.symbol]?.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {selectedChart}/USD
                  </h2>
                  <p className="text-gray-400 text-sm">
                    ${priceData[selectedChart]?.price.toLocaleString()} 
                    <span className={`ml-2 ${priceData[selectedChart]?.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      ({priceData[selectedChart]?.change24h >= 0 ? '+' : ''}{priceData[selectedChart]?.change24h.toFixed(2)}%)
                    </span>
                  </p>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tick={{ fill: '#9CA3AF' }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid #374151',
                        borderRadius: '12px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Swap Interface */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Swap</h2>
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              {showSettings && (
                <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-2">
                      Slippage Tolerance
                    </label>
                    <div className="flex gap-2">
                      {['0.1', '0.5', '1.0'].map(val => (
                        <button
                          key={val}
                          onClick={() => setSlippage(val)}
                          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                            slippage === val 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {val}%
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    <div className="flex justify-between mb-1">
                      <span>Gas Fee:</span>
                      <span>{gasFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network:</span>
                      <span>Ethereum</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {/* From Token */}
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm text-gray-400">From</label>
                    <span className="text-sm text-gray-400">Balance: 12.5456</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <select
                        value={fromToken}
                        onChange={(e) => setFromToken(e.target.value)}
                        className="appearance-none bg-gray-700 text-white px-4 py-2 pr-8 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        {tokens.map(token => (
                          <option key={token.symbol} value={token.symbol}>
                            {token.logo} {token.symbol}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                      className="flex-1 bg-transparent text-white text-right text-2xl font-medium focus:outline-none placeholder-gray-500"
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <span className="text-sm text-gray-400">
                      ≈ ${fromAmount ? (parseFloat(fromAmount) * priceData[fromToken].price).toLocaleString() : '0.00'}
                    </span>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center py-2">
                  <button
                    onClick={swapTokens}
                    className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl transition-colors group"
                  >
                    <ArrowUpDown className="w-5 h-5 text-gray-300 group-hover:text-white transform group-hover:rotate-180 transition-all duration-300" />
                  </button>
                </div>

                {/* To Token */}
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm text-gray-400">To</label>
                    <span className="text-sm text-gray-400">Balance: 1,234.56</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <select
                        value={toToken}
                        onChange={(e) => setToToken(e.target.value)}
                        className="appearance-none bg-gray-700 text-white px-4 py-2 pr-8 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        {tokens.map(token => (
                          <option key={token.symbol} value={token.symbol}>
                            {token.logo} {token.symbol}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                    <input
                      type="number"
                      value={toAmount}
                      readOnly
                      placeholder="0.0"
                      className="flex-1 bg-transparent text-white text-right text-2xl font-medium focus:outline-none placeholder-gray-500"
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <span className="text-sm text-gray-400">
                      ≈ ${toAmount ? (parseFloat(toAmount) * priceData[toToken].price).toLocaleString() : '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Swap Details */}
              {fromAmount && toAmount && (
                <div className="mt-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>Rate</span>
                      <span>1 {fromToken} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(4)} {toToken}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Price Impact</span>
                      <span className={parseFloat(priceImpact) > 3 ? 'text-red-400' : 'text-green-400'}>
                        {priceImpact}%
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Network Fee</span>
                      <span>{gasFee}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Swap Button */}
              <button
                onClick={handleSwap}
                disabled={!walletConnected || !fromAmount || !toAmount || fromAmount === '0' || isLoading}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-4 px-6 rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Swapping...</span>
                  </>
                ) : !walletConnected ? (
                  'Connect Wallet'
                ) : !fromAmount || fromAmount === '0' ? (
                  'Enter Amount'
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
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