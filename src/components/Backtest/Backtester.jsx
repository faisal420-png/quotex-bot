import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import EquityChart from './EquityChart';
import ResultCards from './ResultCards';
import { useLocalAI } from '../../hooks/useLocalAI';
import { fetchHistoricalKlines } from '../../utils/binanceClient';
import { calculateCOG, calculateSignalLine, detectSignal } from '../../utils/cogCalculator';
import { Play, RotateCcw, Brain, BarChart3 } from 'lucide-react';

const Backtester = ({ asset, interval }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [cogPeriod, setCogPeriod] = useState(10);
  const [tradeCount, setTradeCount] = useState(100);
  const { fetchBacktestVerdict } = useLocalAI();
  const [verdict, setVerdict] = useState('');

  const runBacktest = async () => {
    setLoading(true);
    setProgress(0);
    setVerdict('');

    try {
      // 1. Fetch more historical candles (approx 300 to get 100 samples)
      const candles = await fetchHistoricalKlines(asset.symbol, interval.value, 300);
      
      // 2. Indicators
      const cog = calculateCOG(candles, cogPeriod);
      const signal = calculateSignalLine(cog, 3);

      // 3. Simulation
      let wins = 0;
      let losses = 0;
      let balance = 1000;
      const initialBalance = 1000;
      const equityCurve = [{ time: candles[0].time, value: initialBalance }];
      const tradesFound = [];

      for (let i = 1; i < cog.length && tradesFound.length < tradeCount; i++) {
        const sig = detectSignal(cog[i].value, signal[i].value, cog[i-1].value, signal[i-1].value);
        
        if (sig !== 'WAIT') {
          // Check result after 5 candles (simulated 5-min expiry)
          const tradeIndex = candles.findIndex(c => c.time === cog[i].time);
          const resultIndex = tradeIndex + 5;
          
          if (resultIndex < candles.length) {
            const entryPrice = candles[tradeIndex].close;
            const exitPrice = candles[resultIndex].close;
            const isWin = sig === 'CALL' ? exitPrice > entryPrice : exitPrice < entryPrice;
            
            if (isWin) {
              wins++;
              balance += 82; // $100 trade, 82% payout
            } else {
              losses++;
              balance -= 100;
            }

            tradesFound.push({ time: candles[resultIndex].time, value: balance });
            equityCurve.push({ time: candles[resultIndex].time, value: balance });
          }
        }
        setProgress(Math.round((i / cog.length) * 100));
      }

      const winRate = ((wins / (wins + losses)) * 100).toFixed(1);
      const pnl = (balance - initialBalance).toFixed(2);
      const roi = ((pnl / initialBalance) * 100).toFixed(1);

      const stats = { wins, losses, winRate, pnl, roi, trades: tradesFound.length, equityCurve };
      setResults(stats);

      // 4. Gemini Verdict
      const aiVerdict = await fetchBacktestVerdict({ ...stats, asset: asset.symbol });
      setVerdict(aiVerdict);

    } catch (error) {
      console.error('[Backtester] Fail:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Config Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GlassCard>
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Test Configuration</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                   <label className="text-[10px] font-bold text-gray-400 uppercase">COG Lookback Period</label>
                   <span className="text-xs font-bold text-teal-glow">{cogPeriod}</span>
                </div>
                <input 
                  type="range" min="3" max="25" value={cogPeriod} 
                  onChange={(e) => setCogPeriod(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-teal-glow" 
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                   <label className="text-[10px] font-bold text-gray-400 uppercase">Sample Trade Count</label>
                   <span className="text-xs font-bold text-teal-glow">{tradeCount}</span>
                </div>
                <input 
                  type="range" min="10" max="200" step="10" value={tradeCount} 
                  onChange={(e) => setTradeCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-teal-glow" 
                />
              </div>

              <button 
                onClick={runBacktest}
                disabled={loading}
                className="w-full py-4 rounded-xl teal-gradient text-space-dark font-black uppercase tracking-widest shadow-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <RotateCcw className="animate-spin" size={20} /> : <Play fill="currentColor" size={20} />}
                {loading ? `Simulating ${progress}%` : 'Run Algorithm Test'}
              </button>
            </div>
          </GlassCard>

          {results && (
            <GlassCard className="border-teal-glow/20">
              <div className="flex items-center gap-2 mb-4">
                 <Brain size={18} className="text-teal-glow" />
                 <span className="text-xs font-black uppercase text-gray-400 tracking-widest">AI Performance Audit</span>
              </div>
              <p className="text-sm text-gray-300 italic leading-relaxed">
                {verdict || "Synthesizing algorithm results..."}
              </p>
            </GlassCard>
          )}
        </div>

        {/* Results Data */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {!results && !loading ? (
             <GlassCard className="h-full flex items-center justify-center border-dashed border-gray-800 bg-transparent">
                <div className="flex flex-col items-center opacity-20">
                   <BarChart3 size={64} className="mb-4" />
                   <p className="font-bold uppercase tracking-[0.3em] text-sm">Awaiting Algorithm Trigger</p>
                </div>
             </GlassCard>
          ) : (
            <>
              <ResultCards results={results} />
              <GlassCard className="flex-1">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 px-2">Growth Projection (Equity Curve)</h3>
                <div className="h-[350px]">
                  <EquityChart data={results?.equityCurve} />
                </div>
              </GlassCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Backtester;
