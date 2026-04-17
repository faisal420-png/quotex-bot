import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { useCOG } from '../../hooks/useCOG';

const COGPanel = ({ candles, currentCandle, options = {} }) => {
  const containerRef = useRef();
  const chartRef = useRef();
  const cogSeriesRef = useRef();
  const signalSeriesRef = useRef();

  const { cog = [], signal = [] } = useCOG(candles, currentCandle, options) || {};

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 120,
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#6B7280',
        fontFamily: 'Inter',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.02)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      timeScale: {
        visible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      crosshair: {
        mode: 0,
      },
    });

    chartRef.current = chart;

    const cogSeries = chart.addLineSeries({
      color: '#00FFB2',
      lineWidth: 2,
      priceLineVisible: false,
    });
    cogSeriesRef.current = cogSeries;

    const signalSeries = chart.addLineSeries({
      color: '#F97316',
      lineWidth: 1.5,
      lineStyle: 2, // Dashed
      priceLineVisible: false,
    });
    signalSeriesRef.current = signalSeries;

    // Add zero line
    cogSeries.createPriceLine({
      price: 0,
      color: 'rgba(255, 255, 255, 0.2)',
      lineWidth: 1,
      lineStyle: 1,
      axisLabelVisible: true,
      title: 'Zero',
    });

    const handleResize = () => {
      chart.applyOptions({ width: containerRef.current.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (cogSeriesRef.current && cog?.length > 0) {
      try {
        // Sort and deduplicate by time to prevent lightweight-charts errors
        const sortAndDedupe = (arr) => {
          const mapped = arr.map(v => ({ time: Math.floor(v.time / 1000), value: v.value }));
          const seen = new Set();
          return mapped.filter(v => {
            if (seen.has(v.time)) return false;
            seen.add(v.time);
            return true;
          }).sort((a, b) => a.time - b.time);
        };
        
        cogSeriesRef.current.setData(sortAndDedupe(cog));
        if (signal?.length > 0) {
          signalSeriesRef.current.setData(sortAndDedupe(signal));
        }
        
        // Auto-fit if enough data
        if (cog.length > 10) {
          chartRef.current?.timeScale().fitContent();
        }
      } catch (err) {
        console.warn('[COGPanel] Data sync error:', err);
      }
    }
  }, [cog, signal]);

  return (
    <div className="w-full bg-gray-900/40 rounded-xl border border-gray-800/50 p-2 overflow-hidden relative">
      <div className="absolute top-2 left-4 flex gap-3 z-10">
         <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-teal-glow" />
            <span className="text-[10px] font-black text-gray-500 uppercase">COG</span>
         </div>
         <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[10px] font-black text-gray-500 uppercase">Signal</span>
         </div>
      </div>
      <div ref={containerRef} className="w-full" />
    </div>
  );
};

export default COGPanel;
