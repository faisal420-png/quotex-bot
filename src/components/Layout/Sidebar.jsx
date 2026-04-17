import React from 'react';
import { 
  LineChart, 
  LayoutDashboard, 
  History, 
  Settings, 
  Menu, 
  Terminal,
  Zap,
  Activity
} from 'lucide-react';
import { PulseDot } from '../UI/Badge';

const Sidebar = ({ activeTab, setActiveTab, isOpen, toggle, marketData, indicators }) => {
  const menuItems = [
    { id: 'signals', name: 'Signal Generator', icon: Zap },
    { id: 'backtest', name: 'AI Backtester', icon: Activity },
    { id: 'history', name: 'Trade History', icon: History },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className={`
      relative h-full bg-space-dark border-r border-gray-800 transition-all duration-300 z-30
      ${isOpen ? 'w-60' : 'w-20'}
    `}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3">
          <div className="min-w-[32px] w-8 h-8 rounded-lg bg-teal-glow flex items-center justify-center shadow-glow">
            <LineChart size={20} className="text-space-dark" />
          </div>
          {isOpen && (
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-teal-glow to-blue-400 bg-clip-text text-transparent truncate">
              ANTIGRAVITY
            </span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all group
                  ${isActive 
                    ? 'bg-teal-glow text-space-dark shadow-glow' 
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-teal-glow'
                  }
                `}
              >
                <Icon size={20} className="min-w-[20px]" />
                {isOpen && <span className="text-sm font-semibold">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Indicator Confluence Section */}
        {isOpen && indicators && (
          <div className="px-6 py-4 mt-4">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 block">Indicator Confluence</span>
            <div className="grid grid-cols-1 gap-2">
              {indicators.map((ind) => (
                <div key={ind.name} className="flex items-center justify-between group cursor-default">
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-200 transition-colors">{ind.name}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${ind.on ? 'bg-teal-glow shadow-glow' : 'bg-gray-800'}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer / Status */}
        <div className="p-4 bg-gray-900/40 border-t border-gray-800">
          <div className="flex items-center gap-4 px-2">
            <PulseDot status={marketData.status} />
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-gray-500">Node Status</span>
                <span className={`text-xs font-bold uppercase ${marketData.connected ? 'text-teal-glow' : 'text-put-red'}`}>
                  {marketData.status}
                </span>
              </div>
            )}
          </div>
          
          <button 
            onClick={toggle}
            className="mt-6 w-full flex items-center justify-center p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
