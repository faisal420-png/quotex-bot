import React from 'react';

const TickerTape = () => {
const assets = [
    { sym: 'XAU/USD', price: '2350.45', change: '+0.45%', up: true },
    { sym: 'XAG/USD', price: '28.520', change: '+1.20%', up: true },
    { sym: 'UKOIL', price: '89.10', change: '-0.15%', up: false },
    { sym: 'USOIL', price: '85.30', change: '-0.20%', up: false },
    { sym: 'GOLD_OTC', price: '2352.10', change: '+0.52%', up: true },
    { sym: 'SILV_OTC', price: '28.610', change: '+1.45%', up: true }
  ];

  return (
    <div className="w-full bg-mc-black border-t border-mc-amber overflow-hidden h-10 flex items-center">
      <div className="flex animate-[ticker_30s_linear_infinite] whitespace-nowrap gap-10 px-10">
        {[...assets, ...assets].map((a, i) => (
          <div key={i} className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-gray-500 font-bold uppercase tracking-widest">{a.sym}</span>
            <span className="text-white font-black">${a.price}</span>
            <span className={`font-black ${a.up ? 'text-mc-green' : 'text-mc-red'}`}>
              ({a.change})
            </span>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default TickerTape;
