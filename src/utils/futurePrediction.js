/**
 * Future Prediction Engine
 * Predicts next 2 candles based on COG momentum, ATR range, and crossover strength.
 * Clamped to prevent visual chart spikes from exaggerated predictions.
 */

export const calculateATR = (candles, period = 14) => {
  if (!candles || candles.length <= period) return 0;
  
  // Use the LAST N candles, not the first N
  const startIdx = candles.length - period;
  let trSum = 0;
  for (let i = startIdx; i < candles.length; i++) {
    const high = candles[i]?.high || 0;
    const low = candles[i]?.low || 0;
    const prevClose = candles[i - 1]?.close || candles[i]?.open || 0;
    trSum += Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
  }
  return trSum / period;
};

export const predictFuture = (candles, cogData, signalData, atr, indicators = {}) => {
  if (!candles || candles.length < 5 || !cogData || cogData.length < 3 || !signalData || signalData.length < 1) return null;

  const { rsi = 50, ema50, ema200 } = indicators;
  const lastCandle = candles[candles.length - 1];
  if (!lastCandle) return null;
  
  const lastCOG = cogData[cogData.length - 1]?.value || 0;
  const prevCOG = cogData[cogData.length - 2]?.value || 0;
  const pprevCOG = cogData[cogData.length - 3]?.value || 0;

  // 1. COG Momentum Refinement (Percentage based for scale-invariance)
  const momentum1 = (lastCOG - prevCOG) / (prevCOG || 1);
  const momentum2 = (prevCOG - pprevCOG) / (pprevCOG || 1);
  const weightedMomentum = (momentum1 * 0.7) + (momentum2 * 0.3);

  // 2. Crossover and Gap (Normalized)
  // Higher COG relative to Signal line = BULLISH
  const lastSignal = signalData[signalData.length - 1]?.value || 0;
  const gap = (lastCOG - lastSignal) / (lastSignal || 1);
  
  // 3. Trend Alignment (Confluence)
  let trendStrength = 0;
  if (ema50 && ema200) {
    const isUptrend = lastCandle.close > ema50 && ema50 > ema200;
    const isDowntrend = lastCandle.close < ema50 && ema50 < ema200;
    if (isUptrend) trendStrength = 1;
    if (isDowntrend) trendStrength = -1;
  }

  // 4. Mean Reversion (RSI Analysis)
  let reversionFactor = 1.0;
  if (rsi > 70 && gap > 0) reversionFactor = 0.5; // Overbought, dampen BULL signal
  if (rsi < 30 && gap < 0) reversionFactor = 0.5; // Oversold, dampen BEAR signal
  if (rsi > 80 && gap > 0) reversionFactor = -0.2; // Extreme Overbought, expect reversal
  if (rsi < 20 && gap < 0) reversionFactor = -0.2; // Extreme Oversold, expect reversal

  // 5. Predict P1 Direction and confidence
  // Standard logic: if COG > Signal (gap > 0), it's a BULLISH trend
  let p1Direction = gap > 0 ? 'BULL' : 'BEAR';
  
  // Flip prediction if extreme exhaustion detected
  if (reversionFactor < 0) {
    p1Direction = p1Direction === 'BULL' ? 'BEAR' : 'BULL';
  }

  // Confidence is base 65% + bonus for gap strength and trend alignment
  let p1Confidence = 65 + (Math.abs(gap) * 800) + (Math.abs(trendStrength) * 10);
  if (p1Direction === 'BULL' && trendStrength > 0) p1Confidence += 10;
  if (p1Direction === 'BEAR' && trendStrength < 0) p1Confidence += 10;
  
  p1Confidence = Math.min(p1Confidence * Math.abs(reversionFactor), 98);
  
  // 6. Volatility-Adjusted Move Sizing
  const maxMovePercent = 0.004; // Max 0.4% move per candle
  const clampedATR = Math.min(atr, lastCandle.close * maxMovePercent);
  
  // Move is based on ATR, Momentum, and Reversion factor
  const magnitude = (0.5 + Math.abs(weightedMomentum) * 1500) * Math.abs(reversionFactor);
  const p1Move = clampedATR * magnitude * (p1Direction === 'BULL' ? 1 : -1);
  
  const p1Open = lastCandle.close;
  const p1Close = p1Open + p1Move;
  
  // 7. Predict P2 (Trend Continuation vs Exhaustion)
  const p2Continuity = p1Confidence > 80 ? 0.8 : 0.4;
  const p2Move = p1Move * p2Continuity; 
  const p2Open = p1Close;
  const p2Close = p2Open + p2Move;

  const wickSize = clampedATR * 0.2;

  return {
    p1: {
      open: p1Open,
      close: p1Close,
      high: Math.max(p1Open, p1Close) + (p1Direction === 'BULL' ? wickSize : wickSize * 0.5),
      low: Math.min(p1Open, p1Close) - (p1Direction === 'BEAR' ? wickSize : wickSize * 0.5),
      direction: p1Direction,
      confidence: Math.round(p1Confidence)
    },
    p2: {
      open: p2Open,
      close: p2Close,
      high: Math.max(p2Open, p2Close) + wickSize * 0.5,
      low: Math.min(p2Open, p2Close) - wickSize * 0.5,
      direction: p1Direction,
      confidence: Math.round(p1Confidence * 0.7)
    }
  };
};
