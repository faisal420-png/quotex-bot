import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';
import SignalGenerator from './components/Signal/SignalGenerator';
import Backtester from './components/Backtest/Backtester';
import TradeHistory from './components/History/TradeHistory';
import Settings from './components/Settings/Settings';
import { useBinanceLive } from './hooks/useBinanceLive';
import { useCOG } from './hooks/useCOG';
import { useSettings } from './hooks/useSettings';
import { assets } from './constants/assets';
import { intervals } from './constants/intervals';

const App = () => {
  const [activeTab, setActiveTab] = useState('signals');
  const [currentAsset, setCurrentAsset] = useState(assets[0]);
  const [interval, setInterval] = useState(intervals[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { settings } = useSettings();

  // Primary data hooks
  const marketData = useBinanceLive(currentAsset.symbol, interval.value);
  const cogData = useCOG(marketData.candles, settings.cogPeriod);

  const indicatorStates = [
    { name: 'RSI DIV', on: cogData.rsiDivergence !== 'NONE' },
    { name: 'EMA TREND', on: Math.abs(cogData.ema50 - cogData.ema200) > 0.01 },
    { name: 'PATT', on: !!cogData.candlestickPattern },
    { name: 'VOL', on: true },
    { name: 'MACD', on: cogData.macdSignalType !== 'WAIT' }
  ];

  // Handle asset/interval changes
  const handleAssetChange = (asset) => {
    setCurrentAsset(asset);
  };

  const handleIntervalChange = (val) => {
    setInterval(val);
  };

  return (
    <div className="flex h-screen bg-space-dark text-gray-100 overflow-hidden">
      {/* Sidebar - Collapsible on Desktop/Mobile */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
        marketData={marketData}
        indicators={indicatorStates}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar 
          activeTab={activeTab}
          currentAsset={currentAsset}
          onAssetChange={handleAssetChange}
          interval={interval}
          onIntervalChange={handleIntervalChange}
          marketStatus={marketData.connected}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full"
            >
              {activeTab === 'signals' && (
                <SignalGenerator marketData={marketData} asset={currentAsset} interval={interval} />
              )}
              {activeTab === 'backtest' && (
                <Backtester asset={currentAsset} interval={interval} />
              )}
              {activeTab === 'history' && <TradeHistory />}
              {activeTab === 'settings' && <Settings />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}
    </div>
  );
};

export default App;
