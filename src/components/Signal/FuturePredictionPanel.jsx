import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PredictionBar = ({ prediction, label }) => {
  const isUp = prediction.direction === 'BULL';
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-24 bg-gray-900 rounded-lg border border-gray-800 relative overflow-hidden flex flex-col justify-end p-0.5">
         <motion.div 
           initial={{ height: 0 }}
           animate={{ height: `${prediction.confidence}%` }}
           transition={{ duration: 1, ease: "easeOut" }}
           className={`w-full rounded-md ${isUp ? 'bg-teal-glow shadow-[0_0_15px_rgba(0,255,178,0.4)]' : 'bg-put-red shadow-[0_0_15px_rgba(255,71,87,0.4)]'}`}
         />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm font-black text-white">{prediction.confidence}%</span>
        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">{label}</span>
      </div>
    </div>
  );
};

const FuturePredictionPanel = ({ prediction }) => {
  if (!prediction) return null;
  const isUp = prediction.p1.direction === 'BULL';

  return (
    <GlassCard className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Future Forecast</span>
        <div className="flex items-center gap-1.5">
           <div className="w-1 h-1 rounded-full bg-teal-glow shadow-[0_0_5px_rgba(0,255,178,1)]" />
           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="flex justify-around items-end py-2">
        <PredictionBar prediction={prediction.p1} label="Interval P1" />
        <PredictionBar prediction={prediction.p2} label="Interval P2" />
      </div>

      <div className="flex flex-col gap-3 mt-2">
         <div className="flex justify-between items-center">
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Predicted Shift</span>
            <span className={`text-[11px] font-black tracking-tighter ${isUp ? 'text-teal-glow' : 'text-put-red'}`}>
              {isUp ? '+' : '-'}{Math.abs(prediction.p1.close - prediction.p1.open).toFixed(2)} pts
            </span>
         </div>
         <div className="flex justify-between items-center">
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Momentum</span>
            <div className="flex items-center gap-1">
               <span className={`text-[11px] font-black uppercase tracking-tighter ${isUp ? 'text-teal-glow' : 'text-put-red'}`}>
                 {prediction.p1.direction === 'BULL' ? 'Bullish' : 'Bearish'}
               </span>
               {isUp ? <TrendingUp size={12} className="text-teal-glow" /> : <TrendingDown size={12} className="text-put-red" />}
            </div>
         </div>
      </div>
    </GlassCard>
  );
};

export default FuturePredictionPanel;
