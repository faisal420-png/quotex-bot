import { useState, useEffect, useCallback } from 'react';

const DEFAULT_SETTINGS = {
  cogPeriod: 10,
  signalPeriod: 3,
  geminiModel: 'gemini-1.5-flash',
  minConfidence: 65,
  payout: 82,
  filters: {
    rsiDivergence: true,
    emaTrend: true,
    volume: false,
    candlestick: true,
    news: false
  }
};

export const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('quotex_settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('quotex_settings', JSON.stringify(updated));
      return updated;
    });
    
    // Also update individual keys for easier access by utils
    if (newSettings.geminiModel) localStorage.setItem('gemini_model', newSettings.geminiModel);
  }, []);

  const setApiKey = useCallback((key) => {
    localStorage.setItem('gemini_api_key', key);
  }, []);

  return {
    settings,
    updateSettings,
    setApiKey
  };
};
