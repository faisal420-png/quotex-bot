export const calculateStochastic = (candles, kPeriod = 14, dPeriod = 3, smoothPeriod = 3) => {
  if (!candles || candles.length < kPeriod) return { k: [], d: [] };
  
  const k = [];
  
  for (let i = kPeriod - 1; i < candles.length; i++) {
    const slice = candles.slice(i - kPeriod + 1, i + 1);
    let highestHigh = -Infinity;
    let lowestLow = Infinity;
    
    for (let j = 0; j < slice.length; j++) {
      if (slice[j].high > highestHigh) highestHigh = slice[j].high;
      if (slice[j].low < lowestLow) lowestLow = slice[j].low;
    }
    
    const currentClose = candles[i].close;
    const value = highestHigh === lowestLow ? 50 : ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
    k.push({ time: candles[i].time, value });
  }
  
  const d = [];
  for (let i = smoothPeriod - 1; i < k.length; i++) {
    let sum = 0;
    for (let j = 0; j < smoothPeriod; j++) {
      sum += k[i - j].value;
    }
    d.push({ time: k[i].time, value: sum / smoothPeriod });
  }
  
  return { k, d };
};

export const detectStochasticSignal = (stochastic) => {
  if (!stochastic || !stochastic.k || !stochastic.d || stochastic.k.length < 2) {
    return { type: 'WAIT', reason: 'insufficient_data' };
  }
  
  const k = stochastic.k;
  const d = stochastic.d;
  
  const currK = k[k.length - 1]?.value;
  const currD = d[d.length - 1]?.value;
  const prevK = k[k.length - 2]?.value;
  const prevD = d[d.length - 2]?.value;
  
  if (currK === undefined || currD === undefined) {
    return { type: 'WAIT', reason: 'no_data' };
  }
  
  if (currK < 20 && currD < 20 && prevK <= prevD && currK > currD) {
    return { type: 'CALL', reason: 'oversold_crossover', k: currK, d: currD };
  }
  
  if (currK > 80 && currD > 80 && prevK >= prevD && currK < currD) {
    return { type: 'PUT', reason: 'overbought_crossover', k: currK, d: currD };
  }
  
  if (currK < 10) {
    return { type: 'CALL', reason: 'deeply_oversold', k: currK };
  }
  
  if (currK > 90) {
    return { type: 'PUT', reason: 'deeply_overbought', k: currK };
  }
  
  if (currK > currD && prevK <= prevD) {
    return { type: 'CALL', reason: 'bullish_k_cross_d', k: currK, d: currD };
  }
  
  if (currK < currD && prevK >= prevD) {
    return { type: 'PUT', reason: 'bearish_k_cross_d', k: currK, d: currD };
  }
  
  return { type: 'WAIT', reason: 'neutral' };
};

export const detectStochasticDivergence = (candles, stochastic, lookback = 10) => {
  if (!candles || candles.length < lookback || !stochastic || !stochastic.k) return null;
  
  const recentPrices = candles.slice(-lookback);
  const recentStoch = stochastic.k.slice(-lookback);
  
  let priceLow = Infinity;
  let priceHigh = -Infinity;
  let stochLow = Infinity;
  let stochHigh = -Infinity;
  
  for (let i = 0; i < lookback; i++) {
    if (recentPrices[i].low < priceLow) priceLow = recentPrices[i].low;
    if (recentPrices[i].high > priceHigh) priceHigh = recentPrices[i].high;
    if (recentStoch[i].value < stochLow) stochLow = recentStoch[i].value;
    if (recentStoch[i].value > stochHigh) stochHigh = recentStoch[i].value;
  }
  
  const bullishDiv = priceLow === recentPrices[0].low && stochLow < recentStoch[0].value - 5;
  const bearishDiv = priceHigh === recentPrices[0].high && stochHigh > recentStoch[0].value + 5;
  
  if (bullishDiv) return 'bullish';
  if (bearishDiv) return 'bearish';
  return null;
};

export const calculateStochasticMomentum = (stochastic) => {
  if (!stochastic || !stochastic.k || stochastic.k.length < 5) return 0;
  
  const recent = stochastic.k.slice(-5);
  const avg = recent.reduce((a, b) => a + b.value, 0) / recent.length;
  const current = recent[recent.length - 1].value;
  
  return current - avg;
};