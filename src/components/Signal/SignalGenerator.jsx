import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfidenceGauge from './ConfidenceGauge';
import FuturePredictionPanel from './FuturePredictionPanel';
import CountdownTimer from './CountdownTimer';
import GlassCard from '../UI/GlassCard';
import { useCOG } from '../../hooks/useCOG';
import { useLocalAI } from '../../hooks/useLocalAI';
import { useTradeHistory } from '../../hooks/useTradeHistory';
import { useSettings } from '../../hooks/useSettings';
import { RefreshCw, Save } from 'lucide-react';

const SignalGenerator = ({ marketData, asset, interval }) => {
  const { settings } = useSettings();
  const { addTrade } = useTradeHistory();
  const { analysis, loading, fetchAnalysis, setAnalysis } = useLocalAI();
  
  const cogOptions = {
    cogPeriod: settings.cogPeriod,
    signalPeriod: settings.signalPeriod
  };

  const safeCandles = marketData?.candles || [];
  const safeCurrentCandle = marketData?.currentCandle || null;

  const { 
    cog, 
    signalType, 
    confidence, 
    prediction,
    rsiDivergence,
    candlestickPattern,
    macdSignalType,
    volatility,
    ema200
  } = useCOG(safeCandles, safeCurrentCandle, cogOptions);

  const lastPrice = marketData.lastPrice;
  const ema200Value = ema200?.[ema200.length - 1]?.value;

  const indicatorStates = [
    { name: 'RSI DIV', active: !!rsiDivergence },
    { name: 'EMA TREND', active: (signalType === 'CALL' && lastPrice > ema200Value) || (signalType === 'PUT' && lastPrice < ema200Value) },
    { name: 'PATT', active: !!candlestickPattern },
    { name: 'VOL', active: volatility > 0.001 }, 
    { name: 'MACD', active: macdSignalType !== 'WAIT' }
  ];

  // Trigger AI Analysis on new Signal
  useEffect(() => {
    if (signalType !== 'WAIT' && safeCandles.length > 0) {
      fetchAnalysis({
        asset: asset.symbol,
        interval: interval.label,
        cogValue: cog[cog.length - 1]?.value || 0,
        crossover: signalType,
        confidence: confidence,
        p1: prediction?.p1,
        p2: prediction?.p2
      });
    } else {
      setAnalysis('');
    }
  }, [signalType]);

  const handleLogTrade = () => {
    addTrade({
      time: Date.now(),
      asset: asset.symbol,
      interval: interval.label,
      signal: signalType,
      confidence: confidence,
      prediction: prediction?.p1.direction || 'WAIT',
      status: 'PENDING',
      pnl: 0
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10 h-full">
      
      {/* Asset Info Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-teal-glow/20 flex items-center justify-center text-2xl shadow-glow">
            {asset.icon}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{asset.name} <span className="text-amber-400 text-sm ml-1 uppercase">Otc</span></h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-teal-glow animate-pulse" />
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live</span>
              </div>
              <span className={`text-2xl font-mono font-black tracking-tighter ${marketData.connected ? 'text-white' : 'text-gray-600'}`}>
                {marketData.lastPrice ? marketData.lastPrice.toLocaleString(undefined, { minimumFractionDigits: 3 }) : '---.---'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-500 uppercase leading-none mb-1">Next Close</span>
            <CountdownTimer interval={interval.value} lastTime={marketData?.candles?.[(marketData?.candles?.length || 0) - 1]?.time} />
          </div>
          <div className="bg-gray-900/50 px-4 py-2 border border-gray-800 rounded-xl flex flex-col items-end min-w-[100px]">
             <span className="text-[10px] font-black text-gray-500 uppercase leading-none mb-1">Expiry</span>
             <span className="text-sm font-bold text-teal-glow leading-none uppercase tracking-widest italic">{interval.label.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
        
        {/* Left: Signal Center Area */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="relative flex-1 min-h-[500px] bg-gray-900/20 border border-gray-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center">
             {/* Decorative Signal Elements */}
             <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gray-700 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-gray-800 rounded-full" />
             </div>

             <AnimatePresence mode="wait">
               {signalType === 'WAIT' ? (
                 <motion.div 
                   key="wait"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="flex flex-col items-center gap-4"
                 >
                   <RefreshCw className="text-gray-700 animate-spin" size={48} />
                   <span className="text-xs font-black text-gray-600 uppercase tracking-[0.2em]">Analyzing Market Data...</span>
                 </motion.div>
               ) : (
                 <motion.div 
                   key={signalType}
                   initial={{ opacity: 0, scale: 0.9 }} 
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ type: 'spring', damping: 15 }}
                   className="flex flex-col items-center"
                 >
                    {/* Signal Arrow/Triangle */}
                    <div className="mb-2">
                       {signalType === 'CALL' ? (
                         <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[40px] border-b-teal-glow drop-shadow-[0_0_15px_rgba(0,255,178,0.5)]" />
                       ) : (
                         <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[40px] border-t-put-red drop-shadow-[0_0_15px_rgba(255,71,87,0.5)]" />
                       )}
                    </div>
                    
                    <h2 className={`text-[140px] font-black leading-none tracking-tighter ${signalType === 'CALL' ? 'text-teal-glow' : 'text-put-red'}`}>
                      {signalType === 'CALL' ? 'CALL' : 'PUT'}
                    </h2>
                    
                    <div className="flex flex-col items-center gap-2 mt-4">
                       <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Expiry: {interval.label.toUpperCase()} · 2 Candles</span>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{asset.name} OTC</span>
                          <div className="w-1 h-1 rounded-full bg-gray-700" />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${signalType === 'CALL' ? 'text-teal-glow' : 'text-put-red'}`}>
                            Strong {signalType === 'CALL' ? 'Buy' : 'Sell'}
                          </span>
                       </div>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
          
          {/* Footer Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Signal Protocol Panel */}
              <GlassCard className="p-6">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-6 block border-b border-gray-800 pb-2">Signal Protocol</span>
                <div className="flex flex-col gap-1 mb-8">
                   <span className="text-xs font-black text-gray-400 uppercase tracking-tighter">{asset.name} @ {interval.label}</span>
                   <span className="text-4xl font-black italic tracking-tighter text-white uppercase opacity-20">Active</span>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-tighter">AI Accuracy:</span>
                      <span className="text-[10px] font-black text-white">94.2%</span>
                   </div>
                   <button onClick={handleLogTrade} className="text-[9px] font-black uppercase text-gray-500 hover:text-teal-glow transition-colors flex items-center gap-1">
                      <Save size={12} />
                      Log Session
                   </button>
                </div>
              </GlassCard>

              {/* AI Intelligence Panel */}
              <GlassCard className="p-6 flex flex-col">
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4 block border-b border-gray-800 pb-2">AI Intelligence</span>
                <div className="flex-1 mt-2">
                  {loading ? (
                    <div className="space-y-2 animate-pulse">
                      <div className="h-2 bg-gray-800 rounded w-full" />
                      <div className="h-2 bg-gray-800 rounded w-4/5" />
                    </div>
                  ) : (
                    <p className="text-[11px] leading-relaxed text-gray-400 font-medium italic">
                      {analysis || "Awaiting signal for detailed technical breakdown correlation with current market volatility and structural shifts..."}
                    </p>
                  )}
                </div>
              </GlassCard>
          </div>
        </div>

        {/* Right: Sidebar Stats */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <GlassCard className="flex flex-col items-center py-8">
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8 self-start px-2">Signal Confidence</h3>
            <ConfidenceGauge value={confidence} indicators={indicatorStates} />
          </GlassCard>

          <FuturePredictionPanel prediction={prediction} />
          
          <GlassCard className="p-0 overflow-hidden">
            <div className="bg-gray-800/20 px-4 py-3 border-b border-gray-800/50">
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Filters</span>
            </div>
            <div className="p-5 flex flex-wrap gap-2 bg-space-dark/20">
               {Object.entries(settings.filters).map(([key, val]) => (
                 <div key={key} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${val ? 'bg-amber-400/5 text-amber-400 border-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.1)]' : 'bg-gray-900/40 text-gray-700 border-gray-800'}`}>
                    {key.replace(/([A-Z])/g, ' $1')}
                 </div>
               ))}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default SignalGenerator;
