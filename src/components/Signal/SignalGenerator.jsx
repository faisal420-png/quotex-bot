import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiveChart from '../Chart/LiveChart';
import SignalBox from './SignalBox';
import ConfidenceGauge from './ConfidenceGauge';
import FuturePredictionPanel from './FuturePredictionPanel';
import CountdownTimer from './CountdownTimer';
import GlassCard from '../UI/GlassCard';
import { useCOG } from '../../hooks/useCOG';
import { useLocalAI } from '../../hooks/useLocalAI';
import { useTradeHistory } from '../../hooks/useTradeHistory';
import { useSettings } from '../../hooks/useSettings';
import { Brain, Save, RefreshCw } from 'lucide-react';

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
    signal, 
    prediction, 
    signalType, 
    confidence, 
    atr,
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

  // Trigger Gemini Analysis on new Signal
  useEffect(() => {
    if (signalType !== 'WAIT' && safeCandles.length > 0) {
      const lastCandle = safeCandles[(safeCandles?.length || 0) - 1];
      if (lastCandle) {
        fetchAnalysis({
          asset: asset.symbol,
          interval: interval.label,
          cogValue: cog[cog.length - 1]?.value || 0,
          crossover: signalType,
          confidence: confidence,
          p1: prediction?.p1,
          p2: prediction?.p2
        });
      }
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
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-10">
      
      {/* Asset Info Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-teal-glow/20 flex items-center justify-center text-2xl shadow-glow">
            {asset.icon}
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{asset.name} <span className="text-amber-400 text-sm ml-1">OTC</span></h1>
            <div className="flex items-center gap-3">
              <span className={`text-3xl font-mono font-black tracking-tighter ${marketData.connected ? 'text-white' : 'text-gray-600'}`}>
                {marketData.lastPrice ? marketData.lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '---.--'}
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-teal-glow/10 border border-teal-glow/20">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-glow animate-pulse" />
                <span className="text-[10px] font-black text-teal-glow uppercase tracking-tighter">OTC Live</span>
              </div>
        </div>

        <div className="flex items-center gap-4">
          <CountdownTimer interval={interval.value} lastTime={marketData?.candles?.[(marketData?.candles?.length || 0) - 1]?.time} />
          <div className="bg-gray-900/50 px-4 py-2 border border-gray-800 rounded-xl flex flex-col items-end">
             <span className="text-[10px] font-black text-gray-500 uppercase leading-none mb-1">Expiry</span>
             <span className="text-sm font-bold text-teal-glow leading-none uppercase tracking-widest italic">5 Minutes</span>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left: Chart Area */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <LiveChart marketData={marketData} asset={asset} interval={interval} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <SignalBox 
                type={signalType} 
                confidence={confidence} 
                asset={asset.symbol} 
                interval={interval.label} 
                lastPrice={marketData.lastPrice}
              />
              <div className="flex flex-col gap-4">
                <GlassCard className="flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Brain size={18} className="text-teal-glow" />
                      <span className="text-xs font-black uppercase text-gray-400 tracking-widest">AI Intelligence</span>
                    </div>
                    {loading && <RefreshCw size={14} className="text-teal-glow animate-spin" />}
                  </div>
                  
                  <div className="flex-1">
                    {loading ? (
                      <div className="space-y-2 animate-pulse">
                        <div className="h-3 bg-gray-800 rounded w-full" />
                        <div className="h-3 bg-gray-800 rounded w-4/5" />
                        <div className="h-3 bg-gray-800 rounded w-3/4" />
                      </div>
                    ) : (
                      <p className="text-[13px] leading-relaxed text-gray-300 italic font-medium">
                        {analysis || "Awaiting signal for detailed technical breakdown..."}
                      </p>
                    )}
                  </div>

                  <button 
                    onClick={handleLogTrade}
                    disabled={signalType === 'WAIT'}
                    className={`
                      w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border font-black uppercase tracking-widest transition-all
                      ${signalType === 'WAIT' 
                        ? 'border-gray-800 text-gray-700 cursor-not-allowed' 
                        : 'border-teal-glow/50 text-teal-glow hover:bg-teal-glow hover:text-space-dark shadow-glow'
                      }
                    `}
                  >
                    <Save size={18} />
                    Log Signal to History
                  </button>
                </GlassCard>
              </div>
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
    </div>
    </div>
  );
};

export default SignalGenerator;
