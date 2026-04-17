import React from 'react';
import { TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const TradeRow = ({ trade, onUpdateResult }) => {
  const isCall = trade.signal === 'CALL';
  const isWin = trade.result === 'WIN';
  const isLoss = trade.result === 'LOSS';
  const isPending = trade.result === 'PENDING';

  return (
    <tr className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
      <td className="py-4 px-4 text-xs text-gray-400 font-mono">
        {new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </td>
      <td className="py-4 px-4">
        <span className="text-sm font-bold text-white">{trade.asset}</span>
      </td>
      <td className="py-4 px-4">
        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isCall ? 'bg-primary/20 text-primary' : 'bg-danger/20 text-danger'}`}>
          {isCall ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {trade.signal}
        </span>
      </td>
      <td className="py-4 px-4 text-xs text-gray-300 font-medium">
        {trade.timeframe} / {trade.expiry}
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 w-12 bg-gray-800 rounded-full overflow-hidden">
             <div className="h-full bg-primary" style={{ width: `${trade.confidence}%` }}></div>
          </div>
          <span className="text-[10px] font-bold text-gray-500">{trade.confidence}%</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onUpdateResult(trade.id, 'WIN')}
                className="p-1.5 hover:bg-primary/20 text-gray-500 hover:text-primary rounded-md transition-all"
                title="Mark as Win"
              >
                <CheckCircle2 size={18} />
              </button>
              <button 
                onClick={() => onUpdateResult(trade.id, 'LOSS')}
                className="p-1.5 hover:bg-danger/20 text-gray-500 hover:text-danger rounded-md transition-all"
                title="Mark as Loss"
              >
                <XCircle size={18} />
              </button>
            </div>
          ) : (
            <span className={`text-[10px] font-black uppercase flex items-center gap-1 ${isWin ? 'text-primary' : 'text-danger'}`}>
              {isWin ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
              {trade.result}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TradeRow;
