import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../UI/GlassCard';
import { Toggle } from '../UI/Badge';
import { useSettings } from '../../hooks/useSettings';
import { models } from '../../constants/models';
import { Key, Settings as SettingsIcon, ShieldCheck, Database, Sliders } from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings, setApiKey } = useSettings();
  const { progress, ready } = useLocalAI();
  const [tempKey, setTempKey] = useState(localStorage.getItem('gemini_api_key') || '');

  const handleSaveKey = () => {
    setApiKey(tempKey);
    alert('API Key updated successfully.');
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-20">
      <div className="flex items-center gap-3 mb-2">
        <SettingsIcon size={24} className="text-teal-glow" />
        <h1 className="text-2xl font-black uppercase tracking-widest">Protocol Settings</h1>
      </div>

      {/* Local AI Engine Status */}
      <GlassCard className="border-teal-glow/20">
        <div className="flex items-center gap-2 mb-6">
           <ShieldCheck size={18} className="text-teal-glow" />
           <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Antigravity Local Intelligence</span>
        </div>
        
        <div className="space-y-6">
           <div className="flex flex-col gap-2">
             <div className="flex justify-between items-center mb-1">
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Edge Model: SmolLM-135M</label>
               <span className="text-[10px] font-bold text-teal-glow uppercase">Optimized for WebGPU</span>
             </div>
             
             {/* Progress Bar for first download */}
             <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
               <div 
                 className={`h-full shadow-glow transition-all duration-300 ${ready ? 'bg-teal-glow shadow-glow' : 'bg-blue-500 shadow-blue-500/50'}`} 
                 style={{ width: `${Math.max(5, Math.min(100, progress))} %` }}
               />
             </div>
             <p className="text-[10px] text-gray-600 italic mt-1">
               {ready ? 'AI Status: Operational' : `Initializing Local AI: ${Math.round(progress)}%`}
             </p>
           </div>
        </div>
      </GlassCard>

      {/* Algorithm Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <GlassCard>
            <div className="flex items-center gap-2 mb-6">
               <Sliders size={18} className="text-teal-glow" />
               <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Engine Parameters</span>
            </div>
            
            <div className="space-y-6">
               <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">COG Period</label>
                    <span className="text-xs font-bold text-teal-glow">{settings.cogPeriod}</span>
                  </div>
                  <input 
                    type="range" min="5" max="30" value={settings.cogPeriod} 
                    onChange={(e) => updateSettings({ cogPeriod: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-teal-glow" 
                  />
               </div>

               <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Min Confidence</label>
                    <span className="text-xs font-bold text-teal-glow">{settings.minConfidence}%</span>
                  </div>
                  <input 
                    type="range" min="50" max="95" step="5" value={settings.minConfidence} 
                    onChange={(e) => updateSettings({ minConfidence: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-teal-glow" 
                  />
               </div>
            </div>
         </GlassCard>

         <GlassCard>
            <div className="flex items-center gap-2 mb-6">
               <Database size={18} className="text-teal-glow" />
               <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Trade Execution Filters</span>
            </div>
            
            <div className="space-y-4">
               {Object.entries(settings.filters).map(([key, val]) => (
                 <div key={key} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl border border-gray-800">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      {key.replace(/([A-Z])/g, ' $1')} Detection
                    </span>
                    <Toggle 
                      enabled={val} 
                      onChange={(newVal) => updateSettings({ filters: { ...settings.filters, [key]: newVal } })} 
                    />
                 </div>
               ))}
            </div>
         </GlassCard>
      </div>

      <div className="mt-4 flex justify-between items-center opacity-40">
         <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Antigravity Protocol v1.0.4 - Local Build</span>
         <div className="flex gap-4">
            <span className="text-[10px] font-bold text-gray-500 hover:text-teal-glow cursor-pointer underline">Documentation</span>
            <span className="text-[10px] font-bold text-gray-500 hover:text-teal-glow cursor-pointer underline">Support</span>
         </div>
      </div>
    </div>
  );
};

export default Settings;
