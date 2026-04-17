import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import { TrendingUp, TrendingDown, Hourglass } from 'lucide-react';

const SignalBox = ({ type, confidence, asset, interval, lastPrice }) => {
  const isCall = type === 'CALL';
  const isPut = type === 'PUT';
  const isWait = type === 'WAIT';

  const containerVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', damping: 20, stiffness: 100 }
    },
    exit: { scale: 0.95, opacity: 0 }
  };

  const getStyle = () => {
    if (isCall) return 'bg-teal-glow/5 border-teal-glow shadow-[0_0_30px_rgba(0,255,178,0.15)]';
    if (isPut) return 'bg-put-red/5 border-put-red shadow-[0_0_30px_rgba(255,71,87,0.15)]';
    return 'bg-gray-900 border-gray-700';
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={type}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1"
      >
        <GlassCard className={`h-full border-2 transition-all duration-700 ${getStyle()}`}>
          <div className="flex flex-col h-full justify-between gap-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Signal Protocol</span>
                <span className="text-xs font-bold text-gray-300">{asset} @ {interval}</span>
              </div>
              <div className="bg-space-dark/50 px-3 py-1 rounded-lg border border-gray-800 text-[10px] font-mono font-bold text-gray-400">
                PRICE: {(() => {
                  const precision = asset.includes('SILVER') ? 3 : asset.includes('GOLD') ? 2 : 2;
                  return lastPrice?.toFixed(precision);
                })()}
              </div>
            </div>

            <div className="flex items-center gap-6 py-4">
              <div className={`p-4 rounded-2xl ${isCall ? 'bg-teal-glow shadow-glow' : isPut ? 'bg-put-red shadow-glow-red' : 'bg-gray-800'}`}>
                {isCall && <TrendingUp size={48} className="text-space-dark" />}
                {isPut && <TrendingDown size={48} className="text-white" />}
                {isWait && <Hourglass size={48} className="text-gray-500 animate-pulse" />}
              </div>
              
              <div className="flex flex-col">
                <h2 className={`text-6xl font-black italic tracking-tighter leading-none ${isCall ? 'text-teal-glow' : isPut ? 'text-put-red' : 'text-gray-500'}`}>
                  {isWait ? 'WAITING' : type}
                </h2>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">
                   {isWait ? 'Analyzing Market Sentiment...' : `${confidence}% Setup Probability`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 h-1.5 w-full bg-gray-900/50 rounded-full overflow-hidden">
               {Array.from({ length: 5 }).map((_, i) => (
                 <motion.div 
                    key={i} 
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: confidence > (i * 15 + 20) ? 1 : 0.1 }}
                    className={`h-full flex-1 ${isCall ? 'bg-teal-glow' : isPut ? 'bg-put-red' : 'bg-gray-700'}`} 
                 />
               ))}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </AnimatePresence>
  );
};

export default SignalBox;
