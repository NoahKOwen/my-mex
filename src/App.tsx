import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { MarketSelector } from './components/trading/MarketSelector';
import { PriceChart } from './components/trading/PriceChart';
import { OrderBook } from './components/trading/OrderBook';
import { TradingForm } from './components/trading/TradingForm';
import { RecentTrades } from './components/trading/RecentTrades';
import { Portfolio } from './components/portfolio/Portfolio';
import { MarketOverview } from './components/markets/MarketOverview';
import { useMarketData } from './hooks/useMarketData';
import { useAuth } from './hooks/useAuth';

function App() {
  const [selectedPair, setSelectedPair] = useState('BTCUSDT');
  const [activeTab, setActiveTab] = useState<'trade' | 'markets' | 'portfolio'>('trade');
  const { marketData } = useMarketData();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const selectedMarket = marketData.find(
    market => market.trading_pair?.symbol === selectedPair
  );

  const currentPrice = selectedMarket?.price || 43250.50;
  const change24h = selectedMarket?.change_24h || 2.45;
  const high24h = selectedMarket?.high_24h || 44100;
  const low24h = selectedMarket?.low_24h || 42800;
  const baseAsset = selectedMarket?.trading_pair?.base_currency || 'BTC';
  const quoteAsset = selectedMarket?.trading_pair?.quote_currency || 'USDT';

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-700">
        <div className="px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('trade')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'trade'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Trade
            </button>
            <button
              onClick={() => setActiveTab('markets')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'markets'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Markets
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'portfolio'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Portfolio
            </button>
          </nav>
        </div>
      </div>

      <div className="flex-1">
        {activeTab === 'trade' && (
          <div className="grid grid-cols-12 gap-6 p-6 h-[calc(100vh-140px)]">
            {/* Market Selector */}
            <div className="col-span-12 lg:col-span-3">
              <MarketSelector
                selectedPair={selectedPair}
                onSelectPair={setSelectedPair}
              />
            </div>

            {/* Price Chart */}
            <div className="col-span-12 lg:col-span-6">
              <PriceChart
                symbol={selectedPair}
                price={currentPrice}
                change24h={change24h}
                high24h={high24h}
                low24h={low24h}
              />
            </div>

            {/* Trading Form */}
            <div className="col-span-12 lg:col-span-3">
              <TradingForm
                symbol={selectedPair}
                currentPrice={currentPrice}
                baseAsset={baseAsset}
                quoteAsset={quoteAsset}
              />
            </div>

            {/* Order Book */}
            <div className="col-span-12 lg:col-span-4">
              <OrderBook
                symbol={selectedPair}
                currentPrice={currentPrice}
              />
            </div>

            {/* Recent Trades */}
            <div className="col-span-12 lg:col-span-8">
              <RecentTrades
                symbol={selectedPair}
                currentPrice={currentPrice}
              />
            </div>
          </div>
        )}

        {activeTab === 'markets' && (
          <div className="p-6">
            <MarketOverview />
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="p-6">
            <Portfolio />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;