/**
 * Center of Gravity (COG) Indicator Calculator
 * Formula: COG = -SUM(price[j] * (j+1)) / SUM(price[j])
 */

export const calculateCOG = (candles, period = 10) => {
  if (candles.length < period) return [];
  
  const results = [];
  const weightSum = (period * (period + 1)) / 2;
  
  for (let i = period - 1; i < candles.length; i++) {
    let numerator = 0;
    
    for (let j = 0; j < period; j++) {
      const price = candles[i - j].close;
      const weight = (period - j);
      numerator += price * weight;
    }
    
    results.push({
      time: candles[i].time,
      value: (numerator / weightSum)
    });
  }
  return results;
};

export const calculateSignalLine = (cogData, smaPeriod = 3) => {
  if (!cogData || cogData.length < smaPeriod) return [];
  const results = [];
  for (let i = smaPeriod - 1; i < cogData.length; i++) {
    let sum = 0;
    for (let j = 0; j < smaPeriod; j++) {
      sum += cogData[i - j].value;
    }
    results.push({
      time: cogData[i].time,
      value: sum / smaPeriod
    });
  }
  return results;
};

export const calculateEMA = (candles, period) => {
  if (candles.length < period) return [];
  const results = [];
  const k = 2 / (period + 1);
  let ema = candles.slice(0, period).reduce((acc, curr) => acc + curr.close, 0) / period;
  
  results.push({ time: candles[period - 1].time, value: ema });

  for (let i = period; i < candles.length; i++) {
    ema = candles[i].close * k + ema * (1 - k);
    results.push({ time: candles[i].time, value: ema });
  }
  return results;
};

export const calculateRSI = (candles, period = 14) => {
  if (candles.length <= period) return [];
  const results = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  for (let i = period + 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    let currentGain = diff >= 0 ? diff : 0;
    let currentLoss = diff < 0 ? -diff : 0;

    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    results.push({ time: candles[i].time, value: rsi });
  }
  return results;
};

export const detectSignal = (cog, signal, prevCog, prevSignal) => {
  if (!cog || !signal || !prevCog || !prevSignal) return 'WAIT';
  if (cog > signal && prevCog <= prevSignal) return 'CALL';
  if (cog < signal && prevCog >= prevSignal) return 'PUT';
  return 'WAIT';
};

export const getConfidenceScore = (params) => {
  let score = 55;
  const { crossover, divergence, ema200, price, momentum, candlestick, ema50, rsi, volatility, volume } = params;

  if (crossover !== 'WAIT') score += 8;
  if (divergence) score += 7;
  
  if (ema200) {
    if (crossover === 'CALL' && price > ema200) score += 6;
    if (crossover === 'PUT' && price < ema200) score += 6;
  }

  if (ema50 && ema200) {
    if (ema50 > ema200 && crossover === 'CALL') score += 3;
    if (ema50 < ema200 && crossover === 'PUT') score += 3;
  }

  if (momentum > 0 && crossover === 'CALL') score += 4;
  if (momentum < 0 && crossover === 'PUT') score += 4;
  
  if (candlestick === 'engulfing') score += 5;
  if (candlestick === 'hammer') score += 4;
  if (candlestick === 'doji') score += 2;

  if (rsi) {
    if (rsi >= 30 && rsi <= 70) score += 3;
    if (rsi < 30 && crossover === 'CALL') score += 5;
    if (rsi > 70 && crossover === 'PUT') score += 5;
  }

  if (volatility && volatility < 0.02) score += 2;
  if (volume && volume > 1.2) score += 3;

  return Math.min(score, 82);
};

export const detectRSIDivergence = (candles, rsiData) => {
  if (!candles || candles.length < 20 || !rsiData || rsiData.length < 10) return null;
  
  const lookback = 10;
  const recentCandles = candles.slice(-lookback);
  const recentRSI = rsiData.slice(-lookback);
  
  let priceLow = Infinity, priceHigh = -Infinity;
  let rsiLow = Infinity, rsiHigh = -Infinity;
  let priceLowTime = 0, priceHighTime = 0;
  let rsiLowTime = 0, rsiHighTime = 0;
  
  for (let i = 0; i < recentCandles.length; i++) {
    const low = recentCandles[i].low;
    const high = recentCandles[i].high;
    const rsi = recentRSI[i].value;
    
    if (low < priceLow) { priceLow = low; priceLowTime = i; }
    if (high > priceHigh) { priceHigh = high; priceHighTime = i; }
    if (rsi < rsiLow) { rsiLow = rsi; rsiLowTime = i; }
    if (rsi > rsiHigh) { rsiHigh = rsi; rsiHighTime = i; }
  }
  
  const bullishDivergence = priceLow < recentCandles[0].low && rsiLow > recentRSI[0].value + 10;
  const bearishDivergence = priceHigh > recentCandles[0].high && rsiHigh < recentRSI[0].value - 10;
  
  if (bullishDivergence) return 'bullish';
  if (bearishDivergence) return 'bearish';
  return null;
};

export const detectCandlestickPattern = (candles) => {
  if (!candles || candles.length < 3) return null;
  
  const curr = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const prevPrev = candles[candles.length - 3];
  
  if (!curr || !prev || !prevPrev) return null;
  
  const currBody = Math.abs(curr.close - curr.open);
  const currUpperWick = curr.high - Math.max(curr.close, curr.open);
  const currLowerWick = Math.min(curr.close, curr.open) - curr.low;
  const currRange = curr.high - curr.low;
  
  const prevBody = Math.abs(prev.close - prev.open);
  const prevRange = prev.high - prev.low;
  
  if (currBody < currRange * 0.1 && currUpperWick > currBody * 2 && currLowerWick > currBody * 2) {
    return 'doji';
  }
  
  if (currLowerWick > currBody * 2 && currUpperWick < currBody * 0.5 && curr.close > curr.open) {
    return 'hammer';
  }
  
  if (currLowerWick > currBody * 2 && currUpperWick < currBody * 0.5 && curr.close < curr.open) {
    return 'shooting_star';
  }
  
  const isBullishEngulfing = 
    prev.close < prev.open && curr.close > curr.open &&
    curr.open < prev.close && curr.close > prev.open &&
    currBody > prevBody * 1.5;
  
  const isBearishEngulfing = 
    prev.close > prev.open && curr.close < curr.open &&
    curr.open > prev.close && curr.close < prev.open &&
    currBody > prevBody * 1.5;
  
  if (isBullishEngulfing) return 'bullish_engulfing';
  if (isBearishEngulfing) return 'bearish_engulfing';
  
  const prevPrevBody = Math.abs(prevPrev.close - prevPrev.open);
  const isMorningStar = 
    prevPrevBody > prevRange * 0.5 && 
    Math.abs(prev.close - prev.open) < prevRange * 0.3 &&
    curr.close > curr.open &&
    currBody > prevPrevBody * 0.5 &&
    curr.close > (prevPrev.open + prevPrev.close) / 2;
  
  const isEveningStar = 
    prevPrevBody > prevRange * 0.5 && 
    Math.abs(prev.close - prev.open) < prevRange * 0.3 &&
    curr.close < curr.open &&
    currBody > prevPrevBody * 0.5 &&
    curr.close < (prevPrev.open + prevPrev.close) / 2;
  
  if (isMorningStar) return 'morning_star';
  if (isEveningStar) return 'evening_star';
  
  return null;
};

export const detectImprovedSignal = (cog, signal, prevCog, prevSignal, rsi, ema50, ema200, candles) => {
  if (!cog || !signal || !prevCog || !prevSignal) return { type: 'WAIT', reason: 'insufficient_data' };
  
  const rsiValue = rsi?.[rsi.length - 1]?.value || 50;
  const ema50Value = ema50?.[ema50.length - 1]?.value;
  const ema200Value = ema200?.[ema200.length - 1]?.value;
  const lastCandle = candles?.[candles.length - 1];
  const lastPrice = lastCandle?.close || 0;
  
  const cogCrossAbove = cog > signal && prevCog <= prevSignal;
  const cogCrossBelow = cog < signal && prevCog >= prevSignal;
  
  if (!cogCrossAbove && !cogCrossBelow) return { type: 'WAIT', reason: 'no_crossover' };
  
  let bullishConfirmations = 0;
  let bearishConfirmations = 0;
  
  if (ema50Value && ema200Value) {
    if (ema50Value > ema200Value) bullishConfirmations += 2;
    else bearishConfirmations += 2;
  }
  
  if (rsiValue < 40) bullishConfirmations += 2;
  if (rsiValue > 60) bearishConfirmations += 2;
  if (rsiValue > 70) bearishConfirmations -= 1;
  if (rsiValue < 30) bullishConfirmations -= 1;
  
  if (ema200Value && lastPrice > ema200Value) bullishConfirmations += 1;
  if (ema200Value && lastPrice < ema200Value) bearishConfirmations += 1;
  
  const momentum = cog - prevCog;
  if (momentum > 0 && cogCrossAbove) bullishConfirmations += 1;
  if (momentum < 0 && cogCrossBelow) bearishConfirmations += 1;
  
  if (cogCrossAbove && bullishConfirmations >= bearishConfirmations + 2) {
    return { type: 'CALL', reason: 'crossover_bullish', confirmations: bullishConfirmations };
  }
  if (cogCrossBelow && bearishConfirmations >= bullishConfirmations + 2) {
    return { type: 'PUT', reason: 'crossover_bearish', confirmations: bearishConfirmations };
  }
  
  if (cogCrossAbove) return { type: 'CALL', reason: 'crossover_bullish', confirmations: bullishConfirmations };
  if (cogCrossBelow) return { type: 'PUT', reason: 'crossover_bearish', confirmations: bearishConfirmations };
  
  return { type: 'WAIT', reason: 'weak_signal' };
};

export const calculateVolatility = (candles, period = 14) => {
  if (!candles || candles.length < period) return 0;
  
  const returns = [];
  for (let i = 1; i < candles.length; i++) {
    returns.push((candles[i].close - candles[i - 1].close) / candles[i - 1].close);
  }
  
  const recentReturns = returns.slice(-period);
  const mean = recentReturns.reduce((a, b) => a + b, 0) / recentReturns.length;
  const variance = recentReturns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / recentReturns.length;
  
  return Math.sqrt(variance);
};

export const detectSupportResistance = (candles, lookback = 20) => {
  if (!candles || candles.length < lookback) return { support: null, resistance: null };
  
  const recent = candles.slice(-lookback);
  let support = Infinity;
  let resistance = -Infinity;
  
  for (let i = 1; i < recent.length - 1; i++) {
    if (recent[i].low < recent[i - 1].low && recent[i].low < recent[i + 1].low && recent[i].low < support) {
      support = recent[i].low;
    }
    if (recent[i].high > recent[i - 1].high && recent[i].high > recent[i + 1].high && recent[i].high > resistance) {
      resistance = recent[i].high;
    }
  }
  
  return {
    support: support === Infinity ? null : support,
    resistance: resistance === -Infinity ? null : resistance
  };
};
