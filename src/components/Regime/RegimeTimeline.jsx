import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const RegimeTimeline = () => {
  const labels = Array.from({ length: 40 }, (_, i) => '');
  const prices = Array.from({ length: 40 }, () => 1.08 + Math.random() * 0.02);
  
  // Simulated regime data: colors representing different phases
  const regimes = Array.from({ length: 40 }, () => {
    const r = Math.random();
    if (r < 0.1) return '#FF0000'; // Crash
    if (r < 0.3) return '#D85A30'; // Bear
    if (r < 0.7) return '#1F1F1F'; // Neutral
    if (r < 0.9) return '#1D9E75'; // Bull
    return '#FFB000'; // Euphoria
  });

  const chartData = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'Price Flux',
        data: prices,
        borderColor: '#FFB000',
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.2,
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Regime Filter',
        data: Array(40).fill(1.105), // Full height bars
        backgroundColor: regimes,
        barPercentage: 1,
        categoryPercentage: 1,
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: { display: false },
      y: {
        display: false,
        min: 1.075,
        max: 1.105
      },
      y1: {
        display: false,
        min: 0,
        max: 1.105
      }
    }
  };

  return (
    <div className="w-full h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1.5">
           <div className="w-1.5 h-1.5 bg-mc-amber animate-pulse"></div>
           <span className="text-[9px] font-black text-mc-amber uppercase tracking-widest">Historical Timeline // Regime Overlay</span>
        </div>
        <div className="flex gap-4">
           {['Euphoria', 'Bull', 'Neutral', 'Bear', 'Crash'].map(r => (
             <div key={r} className="flex items-center gap-1">
               <div className={`w-1 h-1 rounded-full ${
                 r === 'Euphoria' ? 'bg-mc-amber' : 
                 r === 'Bull' ? 'bg-mc-green' : 
                 r === 'Neutral' ? 'bg-gray-700' :
                 r === 'Bear' ? 'bg-orange-600' : 'bg-mc-red'
               }`}></div>
               <span className="text-[8px] font-bold text-gray-600 uppercase tracking-tighter">{r}</span>
             </div>
           ))}
        </div>
      </div>
      <div className="h-[calc(100%-1.5rem)] relative">
        <Chart type='bar' data={chartData} options={options} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
           <span className="text-4xl font-black text-white italic tracking-[1.5em] font-mono">PRECISION DATA</span>
        </div>
      </div>
    </div>
  );
};

export default RegimeTimeline;
