import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface PriceChartProps {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({
  symbol,
  price,
  change24h,
  high24h,
  low24h,
}) => {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartData, setChartData] = useState<number[]>([]);
  const isPositive = change24h > 0;

  // Generate mock chart data
  useEffect(() => {
    const generateMockData = () => {
      const points = 50;
      const data = [];
      let currentPrice = price - (price * change24h / 100);
      
      for (let i = 0; i < points; i++) {
        const variation = (Math.random() - 0.5) * (price * 0.02);
        currentPrice += variation;
        data.push(currentPrice);
      }
      
      // Ensure the last point matches current price
      data[data.length - 1] = price;
      setChartData(data);
    };

    generateMockData();
    const interval = setInterval(generateMockData, 5000);
    return () => clearInterval(interval);
  }, [price, change24h]);

  const timeframes = ['5M', '15M', '1H', '4H', '1D', '1W'];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle>{symbol}</CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">
                ${price.toLocaleString()}
              </span>
              <div className={`flex items-center text-sm ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(change24h).toFixed(2)}%
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm text-gray-400">
          <span>24h High: <span className="text-green-400">${high24h.toLocaleString()}</span></span>
          <span>24h Low: <span className="text-red-400">${low24h.toLocaleString()}</span></span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="h-64 relative">
          {chartData.length > 0 ? (
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.05" />
                </linearGradient>
              </defs>
              
              {/* Price line */}
              <polyline
                fill="none"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth="2"
                points={chartData.map((value, index) => {
                  const x = (index / (chartData.length - 1)) * 400;
                  const minPrice = Math.min(...chartData);
                  const maxPrice = Math.max(...chartData);
                  const y = 200 - ((value - minPrice) / (maxPrice - minPrice)) * 180;
                  return `${x},${y}`;
                }).join(' ')}
              />
              
              {/* Fill area */}
              <polygon
                fill="url(#priceGradient)"
                points={[
                  ...chartData.map((value, index) => {
                    const x = (index / (chartData.length - 1)) * 400;
                    const minPrice = Math.min(...chartData);
                    const maxPrice = Math.max(...chartData);
                    const y = 200 - ((value - minPrice) / (maxPrice - minPrice)) * 180;
                    return `${x},${y}`;
                  }),
                  '400,200',
                  '0,200'
                ].join(' ')}
              />
            </svg>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center space-x-2 text-gray-400">
                <BarChart3 className="w-5 h-5" />
                <span>Loading chart data...</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};