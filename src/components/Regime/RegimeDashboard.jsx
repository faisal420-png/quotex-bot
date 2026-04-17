import React from 'react';
import RegimeTimeline from './RegimeTimeline';
import SentimentGauge from './SentimentGauge';
import TickerTape from './TickerTape';
import { ShieldCheck, Activity, Terminal, LayoutGrid, Zap, Target } from 'lucide-react';

const RegimeDashboard = () => {
  const regimes = [
    { name: 'CRASH', ret: '-4.2%', vol: '38.2%', strat: 'SHORT' },
    { name: 'BEAR', ret: '-1.1%', vol: '22.4%', strat: 'HEDGE' },
    { name: 'NEUTRAL', ret: '+0.8%', vol: '12.3%', strat: 'ALPHA' },
    { name: 'BULL', ret: '+2.3%', vol: '14.8%', strat: 'LONG' },
    { name: 'EUPHORIA', ret: '+3.1%', vol: '28.5%', strat: 'LEVER' }
  ];

  const signals = [
    { time: '14:22:01', sym: 'NVDA', pos: 'BUY', conf: '0.98' },
    { time: '14:18:55', sym: 'AAPL', pos: 'BUY', conf: '0.82' },
    { time: '14:08:12', sym: 'TSLA', pos: 'SELL', conf: '0.74' },
    { time: '13:58:33', sym: 'SPY', pos: 'HOLD', conf: '0.68' },
    { time: '13:42:08', sym: 'AMD', pos: 'BUY', conf: '0.91' }
  ];

  const RiskItem = ({ label, value, max, unit = '%', isArmed }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-900 last:border-0 group cursor-default">
      <div className="flex flex-col">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className="text-xs font-mono font-black text-white">{value}{unit}</span>
          {max && <span className="text-[9px] font-bold text-gray-700 ml-1">/ {max}{unit}</span>}
        </div>
        <div className={`w-1.5 h-1.5 rounded-full ${isArmed ? 'bg-mc-green shadow-[0_0_8px_#00FF00]' : 'bg-mc-red'} animate-pulse`}></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mc-black flex flex-col font-mono text-white p-2 sm:p-4 lg:p-6 space-y-6">
      
      {/* Top Section: Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[400px]">
        {/* Timeline Chart */}
        <div className="lg:col-span-8 bg-mc-black border border-mc-amber rounded-none relative overflow-hidden group">
          <RegimeTimeline />
        </div>

        {/* Sentiment Gauge */}
        <div className="lg:col-span-4 bg-mc-black border border-mc-amber rounded-none p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
             <Activity size={14} className="text-mc-amber" />
             <span className="text-[10px] font-black uppercase text-mc-amber tracking-widest">Sentiment Distribution</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
             <SentimentGauge value={62.4} />
          </div>
        </div>
      </div>

      {/* Middle Section: Command Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        
        {/* Card 1: Regimes */}
        <div className="bg-mc-black border border-mc-amber rounded-none flex flex-col">
          <div className="p-3 border-b border-mc-amber flex items-center gap-2 bg-mc-amber/5">
             <LayoutGrid size={14} className="text-mc-amber" />
             <span className="text-[10px] font-black uppercase text-mc-amber tracking-widest text shadow-sm">HMM Learned Regimes</span>
          </div>
          <div className="p-0 overflow-hidden flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="py-2 px-3 text-[9px] font-black text-gray-500 uppercase">Regime</th>
                  <th className="py-2 px-3 text-[9px] font-black text-gray-500 uppercase text-right">E[Ret]</th>
                  <th className="py-2 px-3 text-[9px] font-black text-gray-500 uppercase text-right">E[Vol]</th>
                  <th className="py-2 px-3 text-[9px] font-black text-gray-500 uppercase text-right">Strat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {regimes.map((r, i) => (
                  <tr key={i} className="hover:bg-mc-amber/5 transition-colors group cursor-default">
                    <td className={`py-2.5 px-3 text-[10px] font-black ${
                      r.name === 'CRASH' ? 'text-mc-red' : r.name === 'EUPHORIA' ? 'text-mc-amber' : 'text-white'
                    }`}>
                      {r.name}
                    </td>
                    <td className="py-2.5 px-3 text-[10px] font-black text-right">{r.ret}</td>
                    <td className="py-2.5 px-3 text-[10px] font-black text-right text-gray-400">{r.vol}</td>
                    <td className={`py-2.5 px-3 text-[10px] font-black text-right ${
                      r.strat === 'SHORT' ? 'text-mc-red' : r.strat === 'LONG' ? 'text-mc-green' : 'text-mc-amber'
                    }`}>
                      {r.strat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 2: Risk Controls */}
        <div className="bg-mc-black border border-mc-amber rounded-none flex flex-col">
          <div className="p-3 border-b border-mc-amber flex items-center gap-2 bg-mc-amber/5">
             <ShieldCheck size={14} className="text-mc-amber" />
             <span className="text-[10px] font-black uppercase text-mc-amber tracking-widest">Risk Controls</span>
          </div>
          <div className="p-4 flex flex-col gap-1 flex-1">
            <RiskItem label="Daily DD Limit" value="1.25" max="2.00" isArmed />
            <RiskItem label="Weekly DD Limit" value="3.40" max="5.00" isArmed />
            <RiskItem label="Peak Drawdown" value="8.12" isArmed />
            <RiskItem label="Net Exposure" value="142" unit="" isArmed />
            <RiskItem label="Circuit Breakers" value="ARMED" unit="" isArmed />
            
            <div className="mt-auto p-3 bg-mc-red/10 border border-mc-red/20 rounded-none flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Zap size={14} className="text-mc-red animate-pulse" />
                 <span className="text-[10px] font-black text-mc-red uppercase">Kill Switch</span>
              </div>
              <button className="px-4 py-1.5 bg-mc-red text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 active:scale-95 transition-all">
                Execute
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Signal Feed */}
        <div className="bg-mc-black border border-mc-amber rounded-none flex flex-col">
          <div className="p-3 border-b border-mc-amber flex items-center gap-2 bg-mc-amber/5">
             <Target size={14} className="text-mc-amber" />
             <span className="text-[10px] font-black uppercase text-mc-amber tracking-widest">Signal Feed</span>
          </div>
          <div className="p-0 overflow-hidden flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-900/50">
                  <th className="py-2 px-3 text-[9px] font-black text-gray-500 uppercase">Time</th>
                  <th className="py-2 px-3 text-[9px] font-black text-gray-500 uppercase">Sym</th>
                  <th className="py-2 px-3 text-[9px] font-black text-gray-500 uppercase">Pos</th>
                  <th className="py-2 px-3 text-[9px] font-black text-gray-500 uppercase text-right">Conf</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {signals.map((s, i) => (
                  <tr key={i} className="hover:bg-mc-amber/5 transition-colors group cursor-default">
                    <td className="py-2.5 px-3 text-[10px] font-black text-gray-400">{s.time}</td>
                    <td className="py-2.5 px-3 text-[10px] font-black text-white">{s.sym}</td>
                    <td className={`py-2.5 px-3 text-[10px] font-black ${
                      s.pos === 'BUY' ? 'text-mc-green' : s.pos === 'SELL' ? 'text-mc-red' : 'text-mc-amber'
                    }`}>
                      {s.pos}
                    </td>
                    <td className="py-2.5 px-3 text-[10px] font-black text-right text-mc-amber font-mono">{s.conf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer: Ticker Tape */}
      <div className="fixed bottom-0 left-0 lg:left-[220px] right-0 z-30">
        <TickerTape />
      </div>

    </div>
  );
};

export default RegimeDashboard;
