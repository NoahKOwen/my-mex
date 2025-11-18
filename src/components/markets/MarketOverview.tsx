import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { useMarketData } from '../../hooks/useMarketData';

export const MarketOverview: React.FC = () => {
  const { marketData, loading } = useMarketData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-8 bg-gray-700 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalVolume = marketData.reduce((sum, market) => sum + market.volume_24h, 0);
  const gainers = marketData.filter(m => m.change_24h > 0).length;
  const losers = marketData.filter(m => m.change_24h < 0).length;
  const topGainer = marketData.reduce((max, market) => 
    market.change_24h > max.change_24h ? market : max, marketData[0] || { change_24h: 0 });

  return (
    <div className="space-y-6">
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">24h Volume</p>
                <p className="text-2xl font-bold text-white">
                  ${(totalVolume / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Markets</p>
                <p className="text-2xl font-bold text-white">{marketData.length}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Gainers</p>
                <p className="text-2xl font-bold text-green-400">{gainers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Losers</p>
                <p className="text-2xl font-bold text-red-400">{losers}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Markets */}
      <Card>
        <CardHeader>
          <CardTitle>Top Markets</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-6 text-gray-400 font-medium">Pair</th>
                  <th className="text-right py-3 px-6 text-gray-400 font-medium">Price</th>
                  <th className="text-right py-3 px-6 text-gray-400 font-medium">24h Change</th>
                  <th className="text-right py-3 px-6 text-gray-400 font-medium">24h Volume</th>
                  <th className="text-right py-3 px-6 text-gray-400 font-medium">24h High</th>
                  <th className="text-right py-3 px-6 text-gray-400 font-medium">24h Low</th>
                </tr>
              </thead>
              <tbody>
                {marketData.slice(0, 10).map((market) => {
                  const isPositive = market.change_24h > 0;
                  return (
                    <tr key={market.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {market.trading_pair?.base_currency?.slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-white">{market.trading_pair?.symbol}</div>
                            <div className="text-sm text-gray-400">
                              {market.trading_pair?.base_currency}/{market.trading_pair?.quote_currency}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right text-white font-medium">
                        ${market.price.toLocaleString()}
                      </td>
                      <td className={`py-4 px-6 text-right font-medium ${
                        isPositive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <div className="flex items-center justify-end">
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {Math.abs(market.change_24h).toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right text-gray-300">
                        ${(market.volume_24h / 1000).toFixed(0)}K
                      </td>
                      <td className="py-4 px-6 text-right text-gray-300">
                        ${market.high_24h.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right text-gray-300">
                        ${market.low_24h.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};