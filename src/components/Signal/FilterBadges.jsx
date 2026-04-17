import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const FilterBadges = ({ settings, signal }) => {
  const filters = [
    { id: 'rsiDivergence', name: 'RSI Div' },
    { id: 'emaTrend', name: 'EMA Trend' },
    { id: 'candlestick', name: 'Patt' },
    { id: 'volume', name: 'Vol' }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 w-full mt-8">
      {filters.map((f) => {
        const isEnabled = settings.filters[f.id];
        const isPassing = signal !== 'WAIT'; // Simplified logic: if signal exists, filters passed
        
        return (
          <div 
            key={f.id}
            className={`
              flex items-center justify-between px-3 py-2 rounded-xl border transition-all
              ${isEnabled 
                ? 'bg-gray-800/50 border-gray-700 hover:border-teal-glow/30' 
                : 'bg-gray-900/10 border-gray-800/30 opacity-40'
              }
            `}
          >
            <span className={`text-[10px] font-black uppercase tracking-widest ${isEnabled ? 'text-gray-300' : 'text-gray-600'}`}>
               {f.name}
            </span>
            {isEnabled && (
              isPassing 
                ? <CheckCircle2 size={12} className="text-teal-glow" />
                : <XCircle size={12} className="text-gray-600" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FilterBadges;
