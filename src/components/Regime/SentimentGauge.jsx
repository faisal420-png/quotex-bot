import React from 'react';
import { motion } from 'framer-motion';

const SentimentGauge = ({ value = 62.4 }) => {
  // Angle calculated for a semi-circle (180 degrees)
  // Mapping 0-100 to -90 to +90 degrees
  const angle = (value / 100) * 180 - 90;

  return (
    <div className="relative w-full aspect-video flex flex-col items-center justify-center p-4">
      <svg viewBox="0 0 200 120" className="w-full h-full transform translate-y-4">
        {/* Background Track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#1F1F1F"
          strokeWidth="12"
          strokeLinecap="butt"
        />
        
        {/* Active Track */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#FFB000"
          strokeWidth="12"
          strokeLinecap="butt"
        />

        {/* Needle */}
        <motion.g
          initial={{ rotate: -90 }}
          animate={{ rotate: angle }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ originX: '100px', originY: '100px' }}
        >
          <line x1="100" y1="100" x2="100" y2="30" stroke="#FFB000" strokeWidth="2" />
          <circle cx="100" cy="100" r="4" fill="#FFB000" />
        </motion.g>

        {/* Labels */}
        <text x="20" y="115" textAnchor="middle" fontSize="6px" fill="#4B4B4B" fontWeight="bold" className="font-mono uppercase">Crash</text>
        <text x="60" y="80" textAnchor="middle" fontSize="6px" fill="#4B4B4B" fontWeight="bold" className="font-mono uppercase">Bear</text>
        <text x="100" y="65" textAnchor="middle" fontSize="6px" fill="#4B4B4B" fontWeight="bold" className="font-mono uppercase">Neutral</text>
        <text x="140" y="80" textAnchor="middle" fontSize="6px" fill="#4B4B4B" fontWeight="bold" className="font-mono uppercase">Bull</text>
        <text x="180" y="115" textAnchor="middle" fontSize="6px" fill="#4B4B4B" fontWeight="bold" className="font-mono uppercase">Euphoria</text>
      </svg>

      <div className="absolute bottom-4 text-center">
        <h2 className="text-4xl font-black text-white italic font-mono tracking-tighter leading-none">{value}</h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Aggregate Index</p>
      </div>
    </div>
  );
};

export default SentimentGauge;
