import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Clock, Globe, ShieldAlert } from 'lucide-react';
import { assets } from '../../constants/assets';
import { intervals } from '../../constants/intervals';
import { motion, AnimatePresence } from 'framer-motion';

const TopBar = ({ activeTab, currentAsset, onAssetChange, interval, onIntervalChange, marketStatus }) => {
  const [time, setTime] = useState(new Date());
  const [assetDropdownOpen, setAssetDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAssetDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-gray-800 bg-space-dark/80 backdrop-blur-sm flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-6">
        {/* OTC Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">OTC</span>
        </div>

        {/* Asset Selector with smooth animation */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setAssetDropdownOpen(!assetDropdownOpen)}
            className="flex items-center gap-3 bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl hover:border-teal-glow/50 transition-all duration-200"
          >
            <span className="text-xl">{currentAsset.icon}</span>
            <div className="flex flex-col items-start translate-y-[-1px]">
               <span className="text-[9px] font-black text-amber-400/80 uppercase leading-none mb-1">OTC Asset</span>
               <span className="text-sm font-bold leading-none">{currentAsset.name}</span>
            </div>
            <motion.div
              animate={{ rotate: assetDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <ChevronDown size={14} className="ml-2 text-gray-400" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {assetDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden"
              >
                <div className="px-4 py-2 border-b border-gray-800 flex justify-between items-center">
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Select Asset</span>
                  <span className="text-[8px] font-bold text-gray-500 italic">COMEX/NYMEX</span>
                </div>
                <div className="grid grid-cols-2 gap-px bg-gray-800/50">
                  {assets.map((asset, idx) => (
                    <motion.button
                      key={asset.symbol}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05, duration: 0.2 }}
                      onClick={() => {
                        onAssetChange(asset);
                        setAssetDropdownOpen(false);
                      }}
                      className={`
                        flex flex-col items-center justify-center gap-2 p-4 text-center
                        transition-all duration-150 relative overflow-hidden
                        ${currentAsset.symbol === asset.symbol
                          ? 'bg-teal-glow/10 text-teal-glow'
                          : 'bg-gray-900/90 hover:bg-gray-800/80 text-gray-400 hover:text-white'
                        }
                      `}
                    >
                      {currentAsset.symbol === asset.symbol && (
                        <div className="absolute top-0 right-0 p-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-teal-glow shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                        </div>
                      )}
                      <span className="text-3xl filter drop-shadow-md">{asset.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-black tracking-tight">{asset.name}</span>
                        <span className="text-[8px] font-mono text-gray-500 uppercase">{asset.symbol.split('_')[0]}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
                <div className="p-2 bg-gray-950/50 border-t border-gray-800">
                   <div className="text-[8px] text-center text-gray-600 font-bold uppercase tracking-tighter">
                      Real-time OTC Data Streams Active
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interval Selector */}
        <div className="flex items-center bg-gray-900 border border-gray-800 p-1 rounded-xl">
          {intervals.map((int) => (
            <button
              key={int.value}
              onClick={() => onIntervalChange(int)}
              className={`
                px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                ${interval.value === int.value 
                  ? 'bg-teal-glow text-space-dark shadow-glow' 
                  : 'text-gray-500 hover:text-white'
                }
              `}
            >
              {int.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Market Status Info */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-500 uppercase">Market Type</span>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-300">OTC MARKET</span>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-800" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-500 uppercase">Availability</span>
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} className="text-teal-glow" />
              <span className="text-xs font-bold">24/7 Always Open</span>
            </div>
          </div>
        </div>

        {/* Global Clock */}
        <div className="flex items-center gap-3 bg-gray-900/50 px-4 py-2 border border-gray-800 rounded-xl">
          <Clock size={16} className="text-teal-glow" />
          <span className="text-sm font-mono font-bold text-white tracking-wider">
            {time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
