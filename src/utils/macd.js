export const calculateEMA = (data, period) => {
  if (!data || data.length < period) return [];
  const results = [];
  const k = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((acc, curr) => acc + curr, 0) / period;
  
  results.push(ema);
  
  for (let i = period; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
    results.push(ema);
  }
  return results;
};

export const calculateMACD = (candles, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
  if (!candles || candles.length < slowPeriod) return { macd: [], signal: [], histogram: [] };
  
  const closes = candles.map(c => c.close);
  
  const fastEMA = calculateEMA(closes, fastPeriod);
  const slowEMA = calculateEMA(closes, slowPeriod);
  
  const macdLine = [];
  const startIdx = slowPeriod - 1;
  
  for (let i = 0; i < slowEMA.length; i++) {
    const fastIdx = i + (fastPeriod - slowPeriod);
    if (fastIdx >= 0 && fastIdx < fastEMA.length) {
      macdLine.push(fastEMA[fastIdx] - slowEMA[i]);
    }
  }
  
  const signalLine = calculateEMA(macdLine, signalPeriod);
  
  const histogram = [];
  for (let i = 0; i < signalLine.length; i++) {
    histogram.push(macdLine[i + signalPeriod - 1] - signalLine[i]);
  }
  
  const results = {
    macd: macdLine.slice(-candles.length).map((value, i) => ({
      time: candles[i + startIdx]?.time,
      value
    })),
    signal: signalLine.map((value, i) => ({
      time: candles[i + startIdx + signalPeriod - 1]?.time,
      value
    })),
    histogram: histogram.map((value, i) => ({
      time: candles[i + startIdx + signalPeriod - 1]?.time,
      value
    }))
  };
  
  return results;
};

export const detectMACDSignal = (macd, signal, prevMacd, prevSignal) => {
  if (!macd || !signal || !prevMacd || !prevSignal) return 'WAIT';
  
  if (macd > signal && prevMacd <= prevSignal) return 'CALL';
  if (macd < signal && prevMacd >= prevSignal) return 'PUT';
  if (macd > 0 && signal > 0 && macd > signal) return 'CALL';
  if (macd < 0 && signal < 0 && macd < signal) return 'PUT';
  
  return 'WAIT';
};

export const detectMACDDivergence = (candles, macdData, lookback = 10) => {
  if (!candles || candles.length < lookback || !macdData || macdData.length < lookback) return null;
  
  const recentPrices = candles.slice(-lookback);
  const recentMACD = macdData.slice(-lookback);
  
  let priceLow = Infinity, priceHigh = -Infinity;
  let macdLow = Infinity, macdHigh = -Infinity;
  
  for (let i = 0; i < lookback; i++) {
    if (recentPrices[i].low < priceLow) priceLow = recentPrices[i].low;
    if (recentPrices[i].high > priceHigh) priceHigh = recentPrices[i].high;
    if (recentMACD[i].value < macdLow) macdLow = recentMACD[i].value;
    if (recentMACD[i].value > macdHigh) macdHigh = recentMACD[i].value;
  }
  
  const priceMakingLowerLow = priceLow === recentPrices[0].low;
  const priceMakingHigherHigh = priceHigh === recentPrices[0].high;
  const macdMakingHigherLow = macdLow > recentMACD[0].value + 0.0001;
  const macdMakingLowerHigh = macdHigh < recentMACD[0].value - 0.0001;
  
  if (priceMakingLowerLow && macdMakingHigherLow) return 'bullish';
  if (priceMakingHigherHigh && macdMakingLowerHigh) return 'bearish';
  return null;
};