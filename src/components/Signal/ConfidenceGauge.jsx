import React from 'react';
import { motion } from 'framer-motion';

const ConfidenceGauge = ({ value = 0, indicators = [] }) => {
  const displayValue = (value || 0).toFixed(1);
  
  const defaultIndicators = [
    { name: 'RSI DIV', active: false },
    { name: 'EMA TREND', active: false },
    { name: 'PATT', active: false },
    { name: 'VOL', active: false },
    { name: 'MACD', active: false }
  ];

  const activeIndicators = indicators.length > 0 ? indicators : defaultIndicators;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Confidence Number */}
      <div className="flex items-baseline mb-4">
        <span className="text-7xl font-bold text-white tracking-tighter">
          {displayValue.split('.')[0]}
        </span>
        <span className="text-4xl font-bold text-white tracking-tighter">
          .{displayValue.split('.')[1]}
        </span>
        <span className="text-xl font-bold text-gray-600 ml-1">%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-[240px] h-[3px] bg-gray-800 rounded-full mb-3 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
        />
      </div>

      {/* Sub-header */}
      <div className="mb-10">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
          High Precision Mode Active
        </span>
      </div>

      {/* Indicators Section */}
      <div className="w-full flex flex-col gap-6">
        <div className="flex flex-col gap-1 border-t border-gray-800 pt-8">
           <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4">Indicators</span>
           <div className="grid grid-cols-2 gap-y-4">
              {activeIndicators.map((ind) => (
                <div key={ind.name} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-sm ${ind.active ? 'bg-teal-glow shadow-[0_0_5px_rgba(0,255,178,0.8)]' : 'bg-gray-800'}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${ind.active ? 'text-teal-glow' : 'text-gray-600'}`}>
                    {ind.name}
                  </span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceGauge;
