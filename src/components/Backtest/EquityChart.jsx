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
  Filler,
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

const EquityChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map((_, i) => i),
    datasets: [
      {
        label: 'Account Equity ($)',
        data: data.map(d => d.value),
        fill: true,
        backgroundColor: 'rgba(0, 255, 178, 0.1)',
        borderColor: '#00FFB2',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
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
        backgroundColor: '#111827',
        titleFont: { family: 'Inter', weight: 'bold' },
        bodyFont: { family: 'Inter' },
        borderColor: 'rgba(0, 255, 178, 0.2)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#6B7280',
          font: { family: 'Inter', size: 10 },
          callback: (val) => `$${val}`,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default EquityChart;
