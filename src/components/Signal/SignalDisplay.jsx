import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, PauseCircle } from 'lucide-react';

const SignalDisplay = ({ signal, confidence }) => {
  const isCall = signal === 'CALL';
  const isPut = signal === 'PUT';
  const isWait = signal === 'WAIT';

  const bgColor = isCall ? 'bg-primary' : isPut ? 'bg-danger' : 'bg-gray-800';
  const Icon = isCall ? TrendingUp : isPut ? TrendingDown : PauseCircle;
  const signalText = isCall ? 'Strong Call' : isPut ? 'Strong Put' : 'Wait for Signal';

  return (
    <div className={`relative overflow-hidden rounded-card p-6 h-full flex flex-col justify-between transition-colors duration-500 ${bgColor}`}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Icon size={120} />
      </div>

      <div className="relative z-10 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Icon size={18} />
          <span className="text-xs font-bold uppercase tracking-widest opacity-80">Market Signal</span>
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
          {signalText}
        </h2>
      </div>

      <div className="relative z-10 w-full space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-white/70 uppercase">Signal Confidence</span>
          <span className="text-3xl font-black text-white italic">{confidence}%</span>
        </div>
        
        <div className="h-3 bg-black/30 rounded-full overflow-hidden border border-white/10 p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${isWait ? 'bg-gray-400' : 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]'}`}
          />
        </div>
        
        <p className="text-[10px] text-white/60 font-medium uppercase tracking-[0.2em]">
          Algorithm: Antigravity COG v2.2
        </p>
      </div>
    </div>
  );
};

export default SignalDisplay;
