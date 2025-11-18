import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Trade } from '../../types';

interface RecentTradesProps {
  symbol: string;
  currentPrice: number;
}

export const RecentTrades: React.FC<RecentTradesProps> = ({ symbol, currentPrice }) => {
  const [trades, setTrades] = useState<Trade[]>([]);

  // Generate mock recent trades
  useEffect(() => {
    const generateTrades = () => {
      const mockTrades: Trade[] = [];
      
      for (let i = 0; i < 20; i++) {
        const price = currentPrice + (Math.random() - 0.5) * (currentPrice * 0.01);
        const quantity = Math.random() * 5 + 0.1;
        const time = new Date(Date.now() - i * 30000); // 30 seconds apart
        
        mockTrades.push({
          id: `trade-${i}`,
          buyer_order_id: `buyer-${i}`,
          seller_order_id: `seller-${i}`,
          trading_pair_id: 'pair-1',
          quantity,
          price,
          created_at: time.toISOString(),
        });
      }
      
      setTrades(mockTrades);
    };

    generateTrades();
    const interval = setInterval(generateTrades, 5000);
    return () => clearInterval(interval);
  }, [currentPrice]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Recent Trades</span>
          <span className="text-sm text-gray-400">{symbol}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="px-4 py-2 grid grid-cols-3 text-xs text-gray-400 border-b border-gray-700">
          <span>Price</span>
          <span className="text-right">Size</span>
          <span className="text-right">Time</span>
        </div>
        
        <div className="px-4 py-2 space-y-1 max-h-96 overflow-y-auto">
          {trades.map((trade, index) => {
            const isPositive = index === 0 ? true : trade.price > trades[index - 1]?.price;
            const time = new Date(trade.created_at);
            
            return (
              <div key={trade.id} className="grid grid-cols-3 text-xs hover:bg-gray-700/30 py-1">
                <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                  {trade.price.toFixed(2)}
                </span>
                <span className="text-right text-gray-300">
                  {trade.quantity.toFixed(4)}
                </span>
                <span className="text-right text-gray-400">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};