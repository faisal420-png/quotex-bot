import { useState, useCallback } from 'react';
import { getHistory, saveTrade, clearHistory, exportToCSV } from '../utils/tradeLogger';

export const useTradeHistory = () => {
  const [history, setHistory] = useState(getHistory());

  const addTrade = useCallback((trade) => {
    const updated = saveTrade(trade);
    setHistory(updated);
  }, []);

  const resetHistory = useCallback(() => {
    clearHistory();
    setHistory([]);
  }, []);

  const exportHistory = useCallback(() => {
    exportToCSV(history);
  }, [history]);

  return {
    history,
    addTrade,
    resetHistory,
    exportHistory
  };
};
