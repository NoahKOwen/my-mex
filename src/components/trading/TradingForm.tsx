import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../hooks/useAuth';

interface TradingFormProps {
  symbol: string;
  currentPrice: number;
  baseAsset: string;
  quoteAsset: string;
}

export const TradingForm: React.FC<TradingFormProps> = ({
  symbol,
  currentPrice,
  baseAsset,
  quoteAsset,
}) => {
  const { user } = useAuth();
  const [orderType, setOrderType] = useState<'market' | 'limit'>('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState(currentPrice.toString());
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  const total = parseFloat(price) * parseFloat(quantity) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    
    // Simulate order placement
    setTimeout(() => {
      alert(`${side.toUpperCase()} order placed for ${quantity} ${baseAsset} at $${price}`);
      setLoading(false);
      setQuantity('');
    }, 1000);
  };

  const percentageButtons = [25, 50, 75, 100];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Trade {symbol}</CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Order Type Tabs */}
        <div className="flex mb-4 p-1 bg-gray-700 rounded-lg">
          <button
            onClick={() => setOrderType('limit')}
            className={`flex-1 py-2 px-4 text-sm rounded transition-colors ${
              orderType === 'limit'
                ? 'bg-gray-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Limit
          </button>
          <button
            onClick={() => setOrderType('market')}
            className={`flex-1 py-2 px-4 text-sm rounded transition-colors ${
              orderType === 'market'
                ? 'bg-gray-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Market
          </button>
        </div>

        {/* Buy/Sell Tabs */}
        <div className="flex mb-6 space-x-2">
          <button
            onClick={() => setSide('buy')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              side === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Buy {baseAsset}
          </button>
          <button
            onClick={() => setSide('sell')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              side === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Sell {baseAsset}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Price Input */}
          {orderType === 'limit' && (
            <Input
              label={`Price (${quoteAsset})`}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
            />
          )}

          {/* Quantity Input */}
          <Input
            label={`Amount (${baseAsset})`}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0.00"
            step="0.0001"
          />

          {/* Percentage Buttons */}
          <div className="flex space-x-2">
            {percentageButtons.map((percentage) => (
              <button
                key={percentage}
                type="button"
                onClick={() => {
                  // Mock calculation - in real app would use actual balance
                  const mockBalance = 1000;
                  const maxQuantity = orderType === 'market' 
                    ? mockBalance / currentPrice 
                    : mockBalance / parseFloat(price);
                  const newQuantity = (maxQuantity * percentage / 100).toFixed(4);
                  setQuantity(newQuantity);
                }}
                className="flex-1 py-1 px-2 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
              >
                {percentage}%
              </button>
            ))}
          </div>

          {/* Total */}
          <div className="p-3 bg-gray-700 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total:</span>
              <span className="text-white font-medium">
                {total.toFixed(2)} {quoteAsset}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          {user ? (
            <Button
              type="submit"
              variant={side === 'buy' ? 'success' : 'danger'}
              className="w-full"
              loading={loading}
              disabled={!quantity || (orderType === 'limit' && !price)}
            >
              {side === 'buy' ? 'Buy' : 'Sell'} {baseAsset}
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => alert('Please sign in to trade')}
            >
              Sign In to Trade
            </Button>
          )}
        </form>

        {/* Balance Info */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{baseAsset} Available:</span>
            <span>--</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{quoteAsset} Available:</span>
            <span>--</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};