import React from 'react';

const IndicatorToggles = ({ filters, setFilters }) => {
  const toggleOptions = [
    { id: 'rsi', name: 'RSI Divergence', desc: 'Detect overbought/oversold' },
    { id: 'ema', name: 'EMA Trend (50/200)', desc: 'Higher timeframe trend filter' },
    { id: 'volume', name: 'Volume Spike', desc: 'Identify high momentum' },
    { id: 'candle', name: 'Candlestick Patterns', desc: 'Reversal pattern detection' },
    { id: 'news', name: 'News Event Filter', desc: 'Avoid high volatility news' },
  ];

  const handleToggle = (id) => {
    setFilters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {toggleOptions.map((opt) => (
        <label 
          key={opt.id}
          className="flex items-center justify-between p-4 bg-gray-950/50 border border-gray-800 rounded-lg cursor-pointer hover:border-primary/50 transition-all group"
        >
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{opt.name}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{opt.desc}</span>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={filters[opt.id]} 
              onChange={() => handleToggle(opt.id)}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </div>
        </label>
      ))}
    </div>
  );
};

export default IndicatorToggles;
