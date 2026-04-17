import { useState, useEffect, useRef } from 'react';
import { createBinanceSocket, fetchHistoricalKlines } from '../utils/binanceClient';

export const useBinanceLive = (symbol, interval) => {
  const [candles, setCandles] = useState([]);
  const [currentCandle, setCurrentCandle] = useState(null);
  const [status, setStatus] = useState('disconnected');
  const [lastPrice, setLastPrice] = useState(0);
  const [priceChange24h, setPriceChange24h] = useState(0);

  const candlesRef = useRef([]);

  useEffect(() => {
    let disconnect = null;
    let mounted = true;

    const init = async () => {
      // 1. Fetch real historical candles from Binance REST API
      setStatus('connecting');
      const history = await fetchHistoricalKlines(symbol, interval);
      
      if (!mounted) return;
      
      if (history && history.length > 0) {
        setCandles(history);
        candlesRef.current = history;
        setLastPrice(history[history.length - 1]?.close || 0);
        
        // Calculate 24h change from first and last candle
        const firstClose = history[0]?.close || 0;
        const lastClose = history[history.length - 1]?.close || 0;
        if (firstClose > 0) {
          setPriceChange24h(((lastClose - firstClose) / firstClose) * 100);
        }
      }
      
      // 2. Connect to Binance WebSocket for real-time updates
      disconnect = createBinanceSocket(
        symbol, 
        interval, 
        (message) => {
          if (!mounted) return;
          
          setLastPrice(message.close);
          setCurrentCandle(message);
          
          if (message.isClosed) {
            // Push closed candle to history
            const newCandles = [...candlesRef.current, message].slice(-200);
            setCandles(newCandles);
            candlesRef.current = newCandles;
            setCurrentCandle(null);
          }
        },
        (newStatus) => {
          if (mounted) setStatus(newStatus);
        }
      );
    };

    init();

    return () => {
      mounted = false;
      if (disconnect) disconnect();
      setCandles([]);
      setLastPrice(0);
      setCurrentCandle(null);
      candlesRef.current = [];
    };
  }, [symbol, interval]);

  return {
    candles,
    currentCandle,
    connected: status === 'connected',
    status,
    lastPrice,
    priceChange24h
  };
};
