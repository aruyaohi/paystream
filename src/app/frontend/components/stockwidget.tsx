'use client'
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Clock, DollarSign, Euro } from 'lucide-react';

const TeslaStockWidget = () => {
  // Initial state for stock values
  const [stockData, setStockData] = useState({
    usdPrice: 84364.16,
    eurPrice: 221.72,
    change: 0.78,
    changePercent: 0.32,
    isPositive: true,
    volume: "12.4M",
    marketCap: "768.2B",
    pe: 68.3,
    dividend: "0.00",
    high52: 100364.16,
    low52: 84364.16,
    avgVolume: "14.2M"
  });

  // Function to generate random fluctuations
  const generateFluctuation = () => {
    // Random value between -1.5 and 1.5
    const fluctuation = (Math.random() * 3 - 1.5).toFixed(2);
    const newUsdPrice = parseFloat((stockData.usdPrice + parseFloat(fluctuation)).toFixed(2));
    
    // EUR conversion with slight variation in exchange rate
    // const exchangeRate = 0.918 + (Math.random() * 0.004 - 0.002);
    const newEurPrice = parseFloat((newUsdPrice).toFixed(2));
    
    // Calculate change amounts
    const change = parseFloat(fluctuation);
    const changePercent = parseFloat((change / stockData.usdPrice * 100).toFixed(2));
    
    setStockData(prev => ({
      ...prev,
      usdPrice: newUsdPrice,
      eurPrice: newEurPrice,
      change: Math.abs(change),
      changePercent: Math.abs(changePercent),
      isPositive: change >= 0,
      volume: `${(12 + Math.random() * 3).toFixed(1)}M`
    }));
  };

  // Update values every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      generateFluctuation();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [stockData]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Bitcoin, Current Value (BTC)</h2>
              <p className="text-sm text-gray-500">NASDAQ • Last Updated: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">${stockData.usdPrice}</span>
              <div className={`flex items-center ml-2 ${stockData.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stockData.isPositive ? 
                  <ArrowUpRight className="h-5 w-5" /> : 
                  <ArrowDownRight className="h-5 w-5" />
                }
                <span className="text-sm font-medium">{stockData.isPositive ? '+' : '-'}${stockData.change} ({stockData.changePercent}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Currency Comparison */}
      <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Currency Exchange Rates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-gray-800 mr-2" />
                <span className="font-medium text-gray-800">Bitcoin</span>
              </div>
              <span className="font-bold text-gray-900">${stockData.usdPrice}</span>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-500">Reference Currency</span>
              <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">Base</span>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Euro className="h-5 w-5 text-gray-900 mr-2" />
                <span className="font-medium text-gray-800">Tsla</span>
              </div>
              <span className="font-bold text-gray-900">€5000.67</span>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-500">1 TSLA in USDT</span>
              <span className={`text-xs font-medium px-2 py-1 rounded flex items-center ${
                stockData.eurPrice/stockData.usdPrice > 0.92 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {stockData.eurPrice/stockData.usdPrice > 0.92 ? '↑' : '↓'} {((stockData.eurPrice/stockData.usdPrice)*100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Market Statistics */}
      <div className="p-4 sm:p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Market Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Market Cap</p>
            <p className="text-sm font-bold text-gray-900">${stockData.marketCap}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Volume</p>
            <p className="text-sm font-bold text-gray-900">{stockData.volume}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">P/E Ratio</p>
            <p className="text-sm font-bold text-gray-900">{stockData.pe}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Dividend Yield</p>
            <p className="text-sm font-bold text-gray-900">{stockData.dividend}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">52W High</p>
            <p className="text-sm font-bold text-gray-900">${stockData.high52}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">52W Low</p>
            <p className="text-sm font-bold text-gray-900">${stockData.low52}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Avg. Volume</p>
            <p className="text-sm font-bold text-gray-900">{stockData.avgVolume}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Exchange</p>
            <p className="text-sm font-bold text-gray-900">NASDAQ</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>Live data - refreshes automatically</span>
        </div>
        <span>TSLA • {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default TeslaStockWidget;