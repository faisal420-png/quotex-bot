import React from 'react';
import { motion } from 'framer-motion';

const ConfidenceGauge = ({ value = 0 }) => {
  const displayValue = (value || 0).toFixed(1);
  
  return (
    <div className="w-full flex flex-col items-center">
      {/* Confidence Number */}
      <div className="flex items-baseline mb-4">
        <span className="text-7xl font-bold text-white tracking-tighter italic">
          {displayValue.split('.')[0]}
        </span>
        <span className="text-4xl font-bold text-white tracking-tighter italic">
          .{displayValue.split('.')[1]}
        </span>
        <span className="text-xl font-bold text-gray-600 ml-1">%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-[3px] bg-gray-900 rounded-full mb-3 overflow-hidden border border-gray-800">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-teal-glow shadow-glow"
        />
      </div>

      <div className="mt-1">
        <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">
          Signal Integrity Verified
        </span>
      </div>
    </div>
  );
};

export default ConfidenceGauge;
