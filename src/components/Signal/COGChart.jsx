import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const COGChart = ({ prices, cog, signal }) => {
  const chartData = {
    labels: Array(cog.length).fill(''),
    datasets: [
      {
        label: 'COG Line',
        data: cog,
        borderColor: '#1D9E75',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Signal Line',
        data: signal,
        borderColor: '#D85A30',
        borderWidth: 1.5,
        borderDash: [5, 5],
        pointRadius: 0,
        tension: 0.4,
        fill: false,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#161B22',
        titleColor: '#9CA3AF',
        bodyColor: '#FFFFFF',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[220px] bg-gray-950/20 rounded-card p-4 border border-gray-800/50">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default COGChart;
