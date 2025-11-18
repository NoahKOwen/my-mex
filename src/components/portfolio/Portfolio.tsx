import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { TrendingUp, TrendingDown, Eye, EyeOff, Wallet } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Portfolio: React.FC = () => {
  const { user } = useAuth();
  const [hideBalances, setHideBalances] = useState(false);

  // Mock portfolio data
  const portfolioData = {
    totalBalance: 125432.50,
    totalPnL: 8432.25,
    pnlPercentage: 7.23,
    positions: [
      { symbol: 'BTC', amount: 2.45678, value: 105876.25, pnl: 5432.10, pnlPercent: 5.41 },
      { symbol: 'ETH', amount: 15.8934, value: 42123.75, pnl: 2341.85, pnlPercent: 5.88 },
      { symbol: 'BNB', amount: 125.456, value: 39567.80, pnl: 856.30, pnlPercent: 2.21 },
      { symbol: 'ADA', amount: 8456.23, value: 4102.35, pnl: -198.00, pnlPercent: -4.60 },
      { symbol: 'SOL', amount: 45.67, value: 4496.82, pnl: 245.65, pnlPercent: 5.78 },
    ]
  };

  const formatCurrency = (value: number) => {
    if (hideBalances) return '****';
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatAmount = (value: number) => {
    if (hideBalances) return '****';
    return value.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  };

  if (!user) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Sign in to view your portfolio</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Portfolio Overview</CardTitle>
            <button
              onClick={() => setHideBalances(!hideBalances)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {hideBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm">Total Balance</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(portfolioData.totalBalance)}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">24h PnL</p>
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-bold ${
                  portfolioData.totalPnL > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatCurrency(Math.abs(portfolioData.totalPnL))}
                </span>
                <div className={`flex items-center text-sm ${
                  portfolioData.totalPnL > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {portfolioData.totalPnL > 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(portfolioData.pnlPercentage).toFixed(2)}%
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Available Balance</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(portfolioData.totalBalance * 0.85)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holdings */}
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-6 text-gray-400 font-medium">Asset</th>
                  <th className="text-right py-3 px-6 text-gray-400 font-medium">Amount</th>
                  <th className="text-right py-3 px-6 text-gray-400 font-medium">Value</th>
                  <th className="text-right py-3 px-6 text-gray-400 font-medium">24h PnL</th>
                  <th className="text-right py-3 px-6 text-gray-400 font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {portfolioData.positions.map((position) => (
                  <tr key={position.symbol} className="border-b border-gray-700 hover:bg-gray-700/30">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {position.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{position.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right text-white">
                      {formatAmount(position.amount)}
                    </td>
                    <td className="py-4 px-6 text-right text-white font-medium">
                      {formatCurrency(position.value)}
                    </td>
                    <td className={`py-4 px-6 text-right font-medium ${
                      position.pnl > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {position.pnl > 0 ? '+' : ''}{formatCurrency(position.pnl)}
                    </td>
                    <td className={`py-4 px-6 text-right ${
                      position.pnlPercent > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <div className="flex items-center justify-end">
                        {position.pnlPercent > 0 ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        {Math.abs(position.pnlPercent).toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};