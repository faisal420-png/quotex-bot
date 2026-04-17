import React, { useEffect, useRef, useCallback } from 'react';
import { createChart } from 'lightweight-charts';
import { useCOG } from '../../hooks/useCOG';
import GlassCard from '../UI/GlassCard';
import COGPanel from './COGPanel';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

const LiveChart = ({ marketData, asset, interval }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candleSeriesRef = useRef();
  const ema50SeriesRef = useRef();
  const ema200SeriesRef = useRef();

  const safeCandles = marketData?.candles || [];
  const safeCurrentCandle = marketData?.currentCandle || null;
  const { cog, signal, ema50, ema200 } = useCOG(safeCandles, safeCurrentCandle);

  // Sort and deduplicate helpers
  const sortAndDedupeCandles = useCallback((arr) => {
    const seen = new Set();
    return arr.map(c => ({
      time: Math.floor(c.time / 1000),
      open: c.open, high: c.high, low: c.low, close: c.close
    })).filter(c => {
      if (seen.has(c.time)) return false;
      seen.add(c.time);
      return true;
    }).sort((a, b) => a.time - b.time);
  }, []);

  const sortAndDedupeLines = useCallback((arr) => {
    const seen = new Set();
    return arr.map(v => ({ time: Math.floor(v.time / 1000), value: v.value }))
      .filter(v => {
        if (seen.has(v.time)) return false;
        seen.add(v.time);
        return true;
      }).sort((a, b) => a.time - b.time);
  }, []);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    if (!chartRef.current) return;
    const timeScale = chartRef.current.timeScale();
    const range = timeScale.getVisibleLogicalRange();
    if (range) {
      const mid = (range.from + range.to) / 2;
      const span = (range.to - range.from) / 2;
      const newSpan = Math.max(span * 0.6, 5);
      timeScale.setVisibleLogicalRange({ from: mid - newSpan, to: mid + newSpan });
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!chartRef.current) return;
    const timeScale = chartRef.current.timeScale();
    const range = timeScale.getVisibleLogicalRange();
    if (range) {
      const mid = (range.from + range.to) / 2;
      const span = (range.to - range.from) / 2;
      const newSpan = span * 1.5;
      timeScale.setVisibleLogicalRange({ from: mid - newSpan, to: mid + newSpan });
    }
  }, []);

  const handleFitContent = useCallback(() => {
    chartRef.current?.timeScale().fitContent();
  }, []);

  const handleResetZoom = useCallback(() => {
    const ts = chartRef.current?.timeScale();
    if (ts) { ts.resetTimeScale(); ts.fitContent(); }
  }, []);

  // Chart initialization — Quotex-quality styling
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 450,
      layout: {
        background: { type: 'solid', color: '#0b0e11' },
        textColor: '#848e9c',
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.025)', style: 1 },
        horzLines: { color: 'rgba(255, 255, 255, 0.025)', style: 1 },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: 'rgba(150, 160, 175, 0.3)',
          width: 1,
          style: 2,
          labelBackgroundColor: '#2a2e39',
        },
        horzLine: {
          color: 'rgba(150, 160, 175, 0.3)',
          width: 1,
          style: 2,
          labelBackgroundColor: '#2a2e39',
        },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.05, bottom: 0.05 },
        alignLabels: true,
        borderColor: 'transparent',
      },
      timeScale: {
        borderVisible: false,
        borderColor: 'transparent',
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 8,
        barSpacing: 14,
        minBarSpacing: 3,
        fixLeftEdge: false,
        fixRightEdge: false,
      },
      handleScroll: { mouseWheel: true, pressedMouseMove: true },
      handleScale: { mouseWheel: true, pinch: true },
    });
    
    chartRef.current = chart;

    // Main candles — Quotex-style colors
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: true,
      borderUpColor: '#26a69a',
      borderDownColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickVisible: true,
      borderUpVisible: true,
      borderDownVisible: true,
    });
    candleSeriesRef.current = candleSeries;

    // EMA 50 — smooth blue line
    const ema50Series = chart.addLineSeries({
      color: 'rgba(59, 130, 246, 0.5)',
      lineWidth: 1,
      lineStyle: 0,
      priceLineVisible: false,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
    });
    ema50SeriesRef.current = ema50Series;

    // EMA 200 — smooth purple line
    const ema200Series = chart.addLineSeries({
      color: 'rgba(139, 92, 246, 0.4)',
      lineWidth: 1,
      lineStyle: 0,
      priceLineVisible: false,
      crosshairMarkerVisible: false,
      lastValueVisible: false,
    });
    ema200SeriesRef.current = ema200Series;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Data sync — clean, no prediction ghosts
  useEffect(() => {
    if (!candleSeriesRef.current || !safeCandles.length) return;
    
    try {
      const formattedCandles = sortAndDedupeCandles(safeCandles);
      candleSeriesRef.current.setData(formattedCandles);
      
      if (safeCurrentCandle) {
        candleSeriesRef.current.update({
          time: Math.floor(safeCurrentCandle.time / 1000),
          open: safeCurrentCandle.open,
          high: safeCurrentCandle.high,
          low: safeCurrentCandle.low,
          close: safeCurrentCandle.close,
        });
      }

      if (ema50?.length > 0) {
        ema50SeriesRef.current?.setData(sortAndDedupeLines(ema50));
      }
      if (ema200?.length > 0) {
        ema200SeriesRef.current?.setData(sortAndDedupeLines(ema200));
      }
    } catch (err) {
      console.warn('[LiveChart] Data sync error:', err);
    }
  }, [safeCandles, safeCurrentCandle, ema50, ema200, sortAndDedupeCandles, sortAndDedupeLines]);

  return (
    <div className="flex flex-col gap-4">
      <GlassCard className="p-0 border-teal-glow/10 overflow-hidden relative">
        {/* Zoom Controls — Quotex-style floating toolbar */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-0.5 bg-gray-900/70 backdrop-blur-md rounded-lg border border-gray-700/40 p-0.5">
          <button onClick={handleZoomIn} className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:text-white hover:bg-gray-700/50 transition-all duration-150 active:scale-90" title="Zoom In">
            <ZoomIn size={13} />
          </button>
          <button onClick={handleZoomOut} className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:text-white hover:bg-gray-700/50 transition-all duration-150 active:scale-90" title="Zoom Out">
            <ZoomOut size={13} />
          </button>
          <div className="w-px h-4 bg-gray-700/50" />
          <button onClick={handleFitContent} className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:text-white hover:bg-gray-700/50 transition-all duration-150 active:scale-90" title="Fit All">
            <Maximize2 size={13} />
          </button>
          <button onClick={handleResetZoom} className="w-7 h-7 flex items-center justify-center rounded-md text-gray-500 hover:text-white hover:bg-gray-700/50 transition-all duration-150 active:scale-90" title="Reset">
            <RotateCcw size={13} />
          </button>
        </div>

        <div ref={chartContainerRef} className="w-full" />
      </GlassCard>
      
      <COGPanel candles={safeCandles} currentCandle={safeCurrentCandle} />
    </div>
  );
};

export default LiveChart;
