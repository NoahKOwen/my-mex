import React, { useState } from 'react';
import { Search, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { useMarketData } from '../../hooks/useMarketData';

interface MarketSelectorProps {
  selectedPair: string;
  onSelectPair: (symbol: string) => void;
}

export const MarketSelector: React.FC<MarketSelectorProps> = ({
  selectedPair,
  onSelectPair,
}) => {
  const { marketData, loading } = useMarketData();
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredMarkets = marketData.filter(market =>
    market.trading_pair?.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (symbol: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(symbol)) {
      newFavorites.delete(symbol);
    } else {
      newFavorites.add(symbol);
    }
    setFavorites(newFavorites);
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="mb-4">
          <Input
            placeholder="Search markets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />
        </div>

        <div className="space-y-1 max-h-96 overflow-y-auto">
          {filteredMarkets.map((market) => {
            const isPositive = market.change_24h > 0;
            const isSelected = market.trading_pair?.symbol === selectedPair;

            return (
              <div
                key={market.id}
                onClick={() => onSelectPair(market.trading_pair?.symbol || '')}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-blue-900/50 border border-blue-700' 
                    : 'hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(market.trading_pair?.symbol || '');
                    }}
                    className="text-gray-500 hover:text-yellow-400 transition-colors"
                  >
                    <Star 
                      className={`w-4 h-4 ${
                        favorites.has(market.trading_pair?.symbol || '') 
                          ? 'text-yellow-400 fill-current' 
                          : ''
                      }`} 
                    />
                  </button>
                  <div>
                    <div className="font-medium text-white text-sm">
                      {market.trading_pair?.symbol}
                    </div>
                    <div className="text-xs text-gray-400">
                      Vol: {(market.volume_24h / 1000).toFixed(1)}K
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium text-white">
                    ${market.price.toLocaleString()}
                  </div>
                  <div className={`flex items-center text-xs ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(market.change_24h).toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};