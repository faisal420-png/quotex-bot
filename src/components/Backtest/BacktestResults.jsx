import React from 'react';
import { Target, TrendingUp, DollarSign, Activity, Percent, BarChart3, ArrowDownCircle, Award } from 'lucide-react';

const BacktestResults = ({ results }) => {
  const metrics = [
    { label: 'Win Rate', value: `${results.winRate}%`, icon: Target, color: 'text-primary' },
    { label: 'Net P&L', value: `$${results.pnl}`, icon: DollarSign, color: results.pnl >= 0 ? 'text-primary' : 'text-danger' },
    { label: 'ROI', value: `${results.roi}%`, icon: TrendingUp, color: 'text-white' },
    { label: 'Wins', value: results.wins, icon: Award, color: 'text-primary' },
    { label: 'Losses', value: results.losses, icon: ArrowDownCircle, color: 'text-danger' },
    { label: 'Total Trades', value: results.total, icon: Activity, color: 'text-white' },
    { label: 'Max Drawdown', value: `$${results.drawdown}`, icon: BarChart3, color: 'text-danger' },
    { label: 'Profit Factor', value: results.profitFactor, icon: Percent, color: 'text-white' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((m, i) => {
        const Icon = m.icon;
        return (
          <div key={i} className="bg-surface-dark border border-gray-800 p-4 rounded-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-gray-950 flex items-center justify-center border border-gray-800">
                <Icon size={14} className="text-gray-400" />
              </div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{m.label}</span>
            </div>
            <div className={`text-xl font-black ${m.color}`}>{m.value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default BacktestResults;
