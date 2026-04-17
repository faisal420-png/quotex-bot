import { useState, useEffect, useCallback } from 'react';
import { localAI } from '../utils/localAIClient';

export const useLocalAI = () => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Start loading the model immediately on hook mount
    localAI.load();

    const unsubscribe = localAI.addListener((data) => {
      if (data.type === 'ready') setReady(true);
      if (data.type === 'progress' && data.status.status === 'progress') {
        setProgress(data.status.progress);
      }
    });

    return unsubscribe;
  }, []);

  const fetchAnalysis = useCallback((params) => {
    if (!ready) {
      setAnalysis(`System: Local AI is booting... (${Math.round(progress)}%)`);
      return;
    }

    setLoading(true);
    const { asset, interval, signalType, confidence } = params;
    
    // Optimized prompt for SmolLM-135M
    const prompt = `Analyze: ${asset} | Period: ${interval} | Signal: ${signalType} | Confidence: ${confidence}% | Verdict:`;

    localAI.analyze(prompt, (result) => {
      setAnalysis(result);
      setLoading(false);
    });
  }, [ready, progress]);

  const fetchBacktestVerdict = useCallback((stats) => {
    if (!ready) return "Booting...";
    
    setLoading(true);
    const prompt = `Backtest summary for ${stats.asset}: Win Rate ${stats.winRate}%, Profit $${stats.pnl}. Verdict:`;

    return new Promise((resolve) => {
      localAI.analyze(prompt, (result) => {
        setLoading(false);
        resolve(result);
      });
    });
  }, [ready]);

  return {
    analysis,
    loading,
    progress,
    ready,
    fetchAnalysis,
    fetchBacktestVerdict,
    setAnalysis
  };
};
