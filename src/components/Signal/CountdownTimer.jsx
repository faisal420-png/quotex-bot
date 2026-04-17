import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const CountdownTimer = ({ interval, lastTime }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const getIntervalMs = (int) => {
    const unit = int.slice(-1);
    const val = parseInt(int);
    if (unit === 'm') return val * 60 * 1000;
    if (unit === 'h') return val * 60 * 60 * 1000;
    return 60 * 1000;
  };

  useEffect(() => {
    const intervalMs = getIntervalMs(interval);
    
    const update = () => {
      const now = Date.now();
      // Use wall clock buckets to ensure timer stays alive even during data delay
      const nextBucket = Math.ceil(now / intervalMs) * intervalMs;
      const remaining = Math.max(0, Math.floor((nextBucket - now) / 1000));
      setTimeLeft(remaining);
    };

    update();
    const ticker = setInterval(update, 1000);
    return () => clearInterval(ticker);
  }, [interval]);

  // Format MM:SS
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex items-center gap-3 bg-gray-900/50 px-4 py-2 border border-blue-500/20 rounded-xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <Timer size={16} className="text-blue-400 animate-pulse" />
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-gray-500 uppercase leading-none mb-0.5">Next Close</span>
        <span className="text-sm font-mono font-black text-white tracking-widest italic group-hover:text-blue-400 transition-colors">
          {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
