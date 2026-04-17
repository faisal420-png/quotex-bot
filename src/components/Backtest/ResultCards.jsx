import React from 'react';
import { Target, DollarSign, BarChart, Percent } from 'lucide-react';

const StatCard = ({ label, value, sub, icon: Icon, color }) => (
  <div className="flex-1 bg-gray-900/40 border border-gray-800 p-4 rounded-2xl flex items-center gap-4">
    <div className={`p-3 rounded-xl bg-opacity-10 ${color.bg} ${color.text}`}>
       <Icon size={20} />
    </div>
    <div className="flex flex-col">
       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">{label}</span>
       <div className="flex items-baseline gap-2">
         <span className="text-xl font-bold font-mono tracking-tighter text-white">{value}</span>
         {sub && <span className={`text-[10px] font-bold ${color.text}`}>{sub}</span>}
       </div>
    </div>
  </div>
);

const ResultCards = ({ results }) => {
  if (!results) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        label="Win Rate" 
        value={`${results.winRate}%`} 
        sub={`${results.wins} / ${results.trades}`} 
        icon={Target} 
        color={{ bg: 'bg-teal-glow', text: 'text-teal-glow' }} 
      />
      <StatCard 
        label="Total P&L" 
        value={`$${results.pnl}`} 
        sub="Net Profit" 
        icon={DollarSign} 
        color={{ bg: 'bg-teal-glow', text: 'text-teal-glow' }} 
      />
      <StatCard 
        label="Yield ROI" 
        value={`${results.roi}%`} 
        sub="Return" 
        icon={Percent} 
        color={{ bg: 'bg-blue-500', text: 'text-blue-500' }} 
      />
      <StatCard 
        label="Data Stream" 
        value={results.trades} 
        sub="Samples" 
        icon={BarChart} 
        color={{ bg: 'bg-orange-500', text: 'text-orange-500' }} 
      />
    </div>
  );
};

export default ResultCards;
