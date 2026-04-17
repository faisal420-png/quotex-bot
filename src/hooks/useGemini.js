import { useState, useCallback } from 'react';
import { analyzeSignal, analyzeBacktest } from '../utils/geminiClient';

export const useGemini = () => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = useCallback(async (params) => {
    setLoading(true);
    try {
      const result = await analyzeSignal(params);
      setAnalysis(result);
    } catch (error) {
      setAnalysis("Error retrieving AI analysis.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBacktestVerdict = useCallback(async (stats) => {
    setLoading(true);
    try {
      const result = await analyzeBacktest(stats);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    analysis,
    loading,
    fetchAnalysis,
    fetchBacktestVerdict,
    setAnalysis
  };
};
