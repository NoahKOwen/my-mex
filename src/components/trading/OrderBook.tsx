import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { OrderBook as OrderBookType } from '../../types';

interface OrderBookProps {
  symbol: string;
  currentPrice: number;
}

export const OrderBook: React.FC<OrderBookProps> = ({ symbol, currentPrice }) => {
  const [orderBook, setOrderBook] = useState<OrderBookType>({ bids: [], asks: [] });

  // Generate mock order book data
  useEffect(() => {
    const generateOrderBook = () => {
      const bids = [];
      const asks = [];
      
      // Generate bids (buy orders) - prices below current price
      for (let i = 0; i < 10; i++) {
        const price = currentPrice - (i + 1) * (currentPrice * 0.001);
        const quantity = Math.random() * 10 + 0.1;
        const total = price * quantity;
        bids.push({ price, quantity, total });
      }
      
      // Generate asks (sell orders) - prices above current price
      for (let i = 0; i < 10; i++) {
        const price = currentPrice + (i + 1) * (currentPrice * 0.001);
        const quantity = Math.random() * 10 + 0.1;
        const total = price * quantity;
        asks.push({ price, quantity, total });
      }
      
      setOrderBook({ bids: bids.reverse(), asks });
    };

    generateOrderBook();
    const interval = setInterval(generateOrderBook, 3000);
    return () => clearInterval(interval);
  }, [currentPrice]);

  const maxBidTotal = Math.max(...orderBook.bids.map(bid => bid.total));
  const maxAskTotal = Math.max(...orderBook.asks.map(ask => ask.total));

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Order Book</span>
          <span className="text-sm text-gray-400">{symbol}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="px-4 py-2 grid grid-cols-3 text-xs text-gray-400 border-b border-gray-700">
          <span>Price</span>
          <span className="text-right">Size</span>
          <span className="text-right">Total</span>
        </div>
        
        {/* Asks (Sell Orders) */}
        <div className="px-4 py-2 space-y-1 max-h-48 overflow-y-auto">
          {orderBook.asks.slice().reverse().map((ask, index) => (
            <div key={`ask-${index}`} className="relative grid grid-cols-3 text-xs text-red-400 hover:bg-gray-700/30">
              <div
                className="absolute inset-y-0 right-0 bg-red-900/20"
                style={{ width: `${(ask.total / maxAskTotal) * 100}%` }}
              />
              <span className="relative z-10">{ask.price.toFixed(2)}</span>
              <span className="relative z-10 text-right">{ask.quantity.toFixed(4)}</span>
              <span className="relative z-10 text-right">{ask.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        {/* Current Price */}
        <div className="px-4 py-3 bg-gray-700/50 border-y border-gray-700">
          <div className="text-center">
            <span className="text-lg font-bold text-white">
              ${currentPrice.toLocaleString()}
            </span>
          </div>
        </div>
        
        {/* Bids (Buy Orders) */}
        <div className="px-4 py-2 space-y-1 max-h-48 overflow-y-auto">
          {orderBook.bids.map((bid, index) => (
            <div key={`bid-${index}`} className="relative grid grid-cols-3 text-xs text-green-400 hover:bg-gray-700/30">
              <div
                className="absolute inset-y-0 right-0 bg-green-900/20"
                style={{ width: `${(bid.total / maxBidTotal) * 100}%` }}
              />
              <span className="relative z-10">{bid.price.toFixed(2)}</span>
              <span className="relative z-10 text-right">{bid.quantity.toFixed(4)}</span>
              <span className="relative z-10 text-right">{bid.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};