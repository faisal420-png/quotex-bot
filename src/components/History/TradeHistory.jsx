import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import { useTradeHistory } from '../../hooks/useTradeHistory';
import { Download, Trash2, Search, Filter, TrendingUp, TrendingDown } from 'lucide-react';

const TradeHistory = () => {
  const { history, resetHistory, exportHistory } = useTradeHistory();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(t => 
    t.asset.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Action Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-teal-glow outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={exportHistory}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 border border-gray-800 rounded-xl text-xs font-black uppercase tracking-widest hover:border-teal-glow transition-all"
          >
            <Download size={16} />
            Export CSV
          </button>
          <button 
            onClick={resetHistory}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-put-red/10 border border-put-red/20 rounded-xl text-xs font-black uppercase text-put-red tracking-widest hover:bg-put-red hover:text-white transition-all"
          >
            <Trash2 size={16} />
            Clear Data
          </button>
        </div>
      </div>

      {/* History Table */}
      <GlassCard className="flex-1 p-0 overflow-hidden border-gray-800">
        <div className="h-full flex flex-col">
          <div className="grid grid-cols-8 gap-4 px-6 py-4 border-b border-gray-800 bg-gray-800/20">
            <span className="col-span-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Timestamp</span>
            <span className="col-span-1 text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset</span>
            <span className="col-span-1 text-[10px] font-black text-gray-500 uppercase tracking-widest">Signal</span>
            <span className="col-span-1 text-[10px] font-black text-gray-500 uppercase tracking-widest">Conf</span>
            <span className="col-span-1 text-[10px] font-black text-gray-500 uppercase tracking-widest">Prediction</span>
            <span className="col-span-1 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</span>
            <span className="col-span-1 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Action</span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredHistory.length === 0 ? (
              <div className="h-40 flex items-center justify-center opacity-30 italic text-sm">
                Queue is empty. Log a signal to see it here.
              </div>
            ) : (
              filteredHistory.map((trade, idx) => (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={trade.time}
                  className="grid grid-cols-8 gap-4 px-6 py-4 items-center border-b border-gray-800/50 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="col-span-2 text-xs font-mono text-gray-400">{new Date(trade.time).toLocaleString()}</span>
                  <span className="col-span-1 text-xs font-bold">{trade.asset}</span>
                  <span className="col-span-1">
                    <div className={`flex items-center gap-1.5 ${trade.signal === 'CALL' ? 'text-teal-glow' : 'text-put-red'}`}>
                      {trade.signal === 'CALL' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span className="text-xs font-black italic">{trade.signal}</span>
                    </div>
                  </span>
                  <span className="col-span-1 text-xs font-bold text-gray-300">{trade.confidence}%</span>
                  <span className="col-span-1 text-[10px] font-black uppercase text-gray-500">{trade.prediction}</span>
                  <span className="col-span-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {trade.status}
                    </span>
                  </span>
                  <div className="col-span-1 text-right">
                    <button className="text-gray-600 hover:text-white transition-colors">
                       <Filter size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default TradeHistory;
