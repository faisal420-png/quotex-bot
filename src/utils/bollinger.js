export const calculateBollingerBands = (candles, period = 20, stdDev = 2) => {
  if (!candles || candles.length < period) return { upper: [], middle: [], lower: [] };
  
  const upper = [];
  const middle = [];
  const lower = [];
  
  for (let i = period - 1; i < candles.length; i++) {
    const slice = candles.slice(i - period + 1, i + 1).map(c => c.close);
    const sma = slice.reduce((a, b) => a + b, 0) / period;
    
    const squaredDiffs = slice.map(price => Math.pow(price - sma, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
    const sd = Math.sqrt(variance);
    
    middle.push({ time: candles[i].time, value: sma });
    upper.push({ time: candles[i].time, value: sma + (stdDev * sd) });
    lower.push({ time: candles[i].time, value: sma - (stdDev * sd) });
  }
  
  return { upper, middle, lower };
};

export const detectBollingerSignal = (candles, bollingerBands) => {
  if (!candles || candles.length < 1 || !bollingerBands) return { type: 'WAIT', reason: 'insufficient_data' };
  
  const lastCandle = candles[candles.length - 1];
  const lastBB = bollingerBands;
  
  const price = lastCandle.close;
  const upperBB = lastBB.upper?.[lastBB.upper.length - 1]?.value;
  const middleBB = lastBB.middle?.[lastBB.middle.length - 1]?.value;
  const lowerBB = lastBB.lower?.[lastBB.lower.length - 1]?.value;
  
  if (!upperBB || !middleBB || !lowerBB) return { type: 'WAIT', reason: 'no_bands' };
  
  if (price <= lowerBB) {
    return { type: 'CALL', reason: 'at_lower_band_support', distance: (price - lowerBB) / lowerBB };
  }
  
  if (price >= upperBB) {
    return { type: 'PUT', reason: 'at_upper_band_resistance', distance: (price - upperBB) / upperBB };
  }
  
  const bandwidth = (upperBB - lowerBB) / middleBB;
  if (bandwidth < 0.02) {
    return { type: 'WAIT', reason: 'low_volatility_squeeze', bandwidth };
  }
  
  if (price > middleBB && price < upperBB) {
    const proximityToUpper = (upperBB - price) / (upperBB - lowerBB);
    if (proximityToUpper < 0.2) {
      return { type: 'PUT', reason: 'approaching_upper_band', proximity: proximityToUpper };
    }
  }
  
  if (price < middleBB && price > lowerBB) {
    const proximityToLower = (price - lowerBB) / (upperBB - lowerBB);
    if (proximityToLower < 0.2) {
      return { type: 'CALL', reason: 'approaching_lower_band', proximity: proximityToLower };
    }
  }
  
  const momentum = price - middleBB;
  if (momentum > 0) {
    return { type: 'CALL', reason: 'above_middle_band', momentum };
  }
  if (momentum < 0) {
    return { type: 'PUT', reason: 'below_middle_band', momentum };
  }
  
  return { type: 'WAIT', reason: 'neutral' };
};

export const calculateBollingerWidth = (bollingerBands) => {
  if (!bollingerBands || !bollingerBands.upper || bollingerBands.upper.length < 2) return 0;
  
  const upper = bollingerBands.upper[bollingerBands.upper.length - 1]?.value;
  const lower = bollingerBands.lower[bollingerBands.lower.length - 1]?.value;
  const middle = bollingerBands.middle[bollingerBands.middle.length - 1]?.value;
  
  if (!upper || !lower || !middle) return 0;
  
  return (upper - lower) / middle;
};

export const detectBollingerSqueeze = (bollingerBands, lookback = 20) => {
  if (!bollingerBands || !bollingerBands.upper || bollingerBands.upper.length < lookback) return false;
  
  const recentWidths = [];
  for (let i = bollingerBands.upper.length - lookback; i < bollingerBands.upper.length; i++) {
    const upper = bollingerBands.upper[i]?.value;
    const lower = bollingerBands.lower[i]?.value;
    const middle = bollingerBands.middle[i]?.value;
    if (upper && lower && middle) {
      recentWidths.push((upper - lower) / middle);
    }
  }
  
  if (recentWidths.length < lookback) return false;
  
  const currentWidth = recentWidths[recentWidths.length - 1];
  const avgWidth = recentWidths.reduce((a, b) => a + b, 0) / recentWidths.length;
  
  return currentWidth < avgWidth * 0.7;
};