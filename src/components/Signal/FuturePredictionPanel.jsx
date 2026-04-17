import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PredictionBar = ({ prediction, label }) => {
  const isUp = prediction.direction === 'BULL';
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-28 bg-gray-900 border border-gray-800 rounded-sm relative overflow-hidden flex flex-col justify-end p-1">
         <motion.div 
           initial={{ height: 0 }}
           animate={{ height: `${prediction.confidence}%` }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
           className={`w-full rounded-sm ${isUp ? 'bg-teal-glow shadow-[0_0_20px_rgba(45,212,191,0.5)]' : 'bg-put-red shadow-[0_0_20px_rgba(255,71,87,0.5)]'}`}
         />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-black text-white italic tracking-tighter">{prediction.confidence}%</span>
        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">{label}</span>
      </div>
    </div>
  );
};

const FuturePredictionPanel = ({ prediction }) => {
  if (!prediction) return null;
  const isUp = prediction.p1.direction === 'BULL';

  return (
    <GlassCard className="p-6">
      <div className="flex flex-col gap-1 mb-8">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2 mb-2 block">Future Forecast</span>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-teal-glow animate-pulse shadow-glow" />
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="flex justify-around items-end mb-10">
        <PredictionBar prediction={prediction.p1} label="Interval P1" />
        <PredictionBar prediction={prediction.p2} label="Interval P2" />
      </div>

      <div className="space-y-4 border-t border-gray-800 pt-6">
         <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Predicted Shift</span>
            <span className={`text-sm font-black italic tracking-tighter ${isUp ? 'text-teal-glow' : 'text-put-red'}`}>
              {isUp ? '+' : '-'}{Math.abs(prediction.p1.close - prediction.p1.open).toFixed(2)} pts
            </span>
         </div>
         <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Momentum</span>
            <div className="flex items-center gap-2">
               <span className={`text-sm font-black uppercase italic tracking-tighter ${isUp ? 'text-teal-glow' : 'text-put-red'}`}>
                 {prediction.p1.direction === 'BULL' ? 'Bullish' : 'Bearish'}
               </span>
               <div className={`${isUp ? 'animate-bounce' : 'animate-bounce'}`}>
                 {isUp ? <TrendingUp size={16} className="text-teal-glow" /> : <TrendingDown size={16} className="text-put-red" />}
               </div>
            </div>
         </div>
      </div>
    </GlassCard>
  );
};

export default FuturePredictionPanel;
