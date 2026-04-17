import { useState, useMemo } from 'react';
import { 
  calculateCOG, 
  calculateSignalLine, 
  calculateEMA, 
  calculateRSI,
  detectSignal,
  getConfidenceScore,
  detectRSIDivergence,
  detectCandlestickPattern,
  detectImprovedSignal,
  calculateVolatility,
  detectSupportResistance
} from '../utils/cogCalculator';
import { calculateATR, predictFuture } from '../utils/futurePrediction';
import { calculateMACD, detectMACDSignal } from '../utils/macd';
import { calculateBollingerBands, detectBollingerSignal, calculateBollingerWidth, detectBollingerSqueeze } from '../utils/bollinger';
import { calculateStochastic, detectStochasticSignal, detectStochasticDivergence, calculateStochasticMomentum } from '../utils/stochastic';

export const useCOG = (candles, currentCandle, options = {}) => {
  const { cogPeriod = 10, signalPeriod = 3 } = options;

  return useMemo(() => {
    if (!candles || candles.length < 20) {
      return { 
        cog: [], signal: [], ema50: [], ema200: [], 
        prediction: null, signalType: 'WAIT', confidence: 0,
        rsi: [], macd: {}, bollinger: {}, stochastic: {},
        rsiDivergence: null, candlestickPattern: null,
        volatility: 0, supportResistance: {}
      };
    }

    const allCandles = currentCandle ? [...candles, currentCandle] : candles;

    const cog = calculateCOG(allCandles, cogPeriod) || [];
    const signal = calculateSignalLine(cog, signalPeriod) || [];
    const ema50 = calculateEMA(allCandles, 50) || [];
    const ema200 = calculateEMA(allCandles, 200) || [];
    const rsi = calculateRSI(allCandles, 14) || [];
    const atr = calculateATR(allCandles, 14);
    
    const macd = calculateMACD(allCandles, 12, 26, 9);
    const bollinger = calculateBollingerBands(allCandles, 20, 2);
    const stochastic = calculateStochastic(allCandles, 14, 3, 3);
    
    const volatility = calculateVolatility(allCandles, 14);
    const supportResistance = detectSupportResistance(allCandles, 20);
    const rsiDivergence = detectRSIDivergence(allCandles, rsi);
    const candlestickPattern = detectCandlestickPattern(allCandles);
    
    const bollingerSignal = detectBollingerSignal(allCandles, bollinger);
    const stochSignal = detectStochasticSignal(stochastic);
    
    const macdLine = macd.macd[macd.macd.length - 1]?.value;
    const macdSignal = macd.signal[macd.signal.length - 1]?.value;
    const prevMacdLine = macd.macd[macd.macd.length - 2]?.value;
    const prevMacdSignal = macd.signal[macd.signal.length - 2]?.value;
    const macdSignalType = detectMACDSignal(
      macdLine, macdSignal, prevMacdLine, prevMacdSignal
    );

    const lastCog = cog.length > 0 ? cog[cog.length - 1]?.value : 0;
    const lastSignal = signal.length > 0 ? signal[signal.length - 1]?.value : 0;
    const prevCog = cog.length > 1 ? cog[cog.length - 2]?.value : 0;
    const prevSignal = signal.length > 1 ? signal[signal.length - 2]?.value : 0;

    const improvedSignal = detectImprovedSignal(
      lastCog, lastSignal, prevCog, prevSignal, 
      rsi, ema50, ema200, allCandles
    );
    
    const baseSignalType = detectSignal(lastCog, lastSignal, prevCog, prevSignal);
    
    let finalSignalType = improvedSignal.type;
    let signalReason = improvedSignal.reason;
    
    if (baseSignalType !== 'WAIT' && finalSignalType === 'WAIT') {
      finalSignalType = baseSignalType;
      signalReason = 'crossover';
    }
    
    if (bollingerSignal.type !== 'WAIT' && bollingerSignal.type !== finalSignalType) {
      if ((finalSignalType === 'CALL' && bollingerSignal.type === 'PUT') ||
          (finalSignalType === 'PUT' && bollingerSignal.type === 'CALL')) {
        if (bollingerSignal.reason === 'at_lower_band_support' || bollingerSignal.reason === 'at_upper_band_resistance') {
          finalSignalType = bollingerSignal.type;
          signalReason = `bollinger_${bollingerSignal.reason}`;
        }
      }
    }
    
    if (stochSignal.type !== 'WAIT' && stochSignal.type !== finalSignalType && finalSignalType === 'WAIT') {
      finalSignalType = stochSignal.type;
      signalReason = `stochastic_${stochSignal.reason}`;
    }
    
    if (macdSignalType !== 'WAIT' && macdSignalType !== finalSignalType && finalSignalType === 'WAIT') {
      finalSignalType = macdSignalType;
      signalReason = 'macd_crossover';
    }

    const prediction = cog.length > 0 ? predictFuture(allCandles, cog, signal, atr, { 
      rsi: rsi[rsi.length - 1]?.value || 50,
      ema50: ema50[ema50.length - 1]?.value,
      ema200: ema200[ema200.length - 1]?.value
    }) : null;

    const lastPrice = allCandles?.[(allCandles?.length || 0) - 1]?.close || 0;
    const rsiValue = rsi[rsi.length - 1]?.value || 50;
    const ema50Value = ema50[ema50.length - 1]?.value;
    const ema200Value = ema200[ema200.length - 1]?.value;
    const bollingerWidth = calculateBollingerWidth(bollinger);
    const isSqueeze = detectBollingerSqueeze(bollinger);
    const stochMomentum = calculateStochasticMomentum(stochastic);

    const confidence = getConfidenceScore({
      crossover: finalSignalType,
      divergence: rsiDivergence,
      ema200: ema200Value,
      price: lastPrice,
      momentum: lastCog - prevCog,
      candlestick: candlestickPattern,
      ema50: ema50Value,
      rsi: rsiValue,
      volatility,
      volume: null
    });

    if (isSqueeze) {
      signalReason = `${signalReason}_squeeze`;
    }

    return {
      cog,
      signal,
      ema50,
      ema200,
      rsi,
      macd,
      bollinger,
      stochastic,
      prediction,
      signalType: finalSignalType,
      signalReason,
      confidence,
      atr,
      volatility,
      supportResistance,
      rsiDivergence,
      candlestickPattern,
      bollingerSignal,
      stochSignal,
      macdSignalType,
      bollingerWidth,
      isBollingerSqueeze: isSqueeze,
      stochMomentum,
      indicators: {
        rsi: rsiValue,
        ema50: ema50Value,
        ema200: ema200Value,
        macd: macdLine,
        macdSignal: macdSignal,
        stochK: stochastic.k?.[stochastic.k.length - 1]?.value,
        stochD: stochastic.d?.[stochastic.d.length - 1]?.value
      }
    };
  }, [candles, currentCandle, cogPeriod, signalPeriod]);
};