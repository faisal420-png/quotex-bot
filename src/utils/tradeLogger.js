/**
 * Trade Logger Utility
 * Persists trade history in localStorage and provides export features.
 */

const HISTORY_KEY = 'quotex_trade_history';

export const saveTrade = (trade) => {
  try {
    const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const newHistory = [trade, ...existing].slice(0, 500); // Keep last 500 trades
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (error) {
    console.error('[Logger] Save failed:', error);
    return [];
  }
};

export const getHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

export const exportToCSV = (data) => {
  if (!data || data.length === 0) return;

  const headers = ['Time', 'Asset', 'Interval', 'Signal', 'Confidence', 'P1_Pred', 'Status', 'PnL'];
  const rows = data.map(t => [
    new Date(t.time).toLocaleString(),
    t.asset,
    t.interval,
    t.signal,
    `${t.confidence}%`,
    t.prediction,
    t.status,
    t.pnl
  ]);

  const csvContent = 
    "data:text/csv;charset=utf-8," + 
    [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `quotex_trades_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
