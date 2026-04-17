import React from 'react';

export const Badge = ({ children, variant = 'teal' }) => {
  const styles = {
    teal: 'bg-teal-glow/10 text-teal-glow border-teal-glow/20',
    red: 'bg-put-red/10 text-put-red border-put-red/20',
    gray: 'bg-gray-800 text-gray-400 border-gray-700'
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-full ${styles[variant]}`}>
      {children}
    </span>
  );
};

export const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${enabled ? 'bg-teal-glow' : 'bg-gray-700'}`}
  >
    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${enabled ? 'left-6' : 'left-1'}`} />
  </button>
);

export const PulseDot = ({ status }) => {
  const colors = {
    connected: 'bg-teal-glow shadow-[0_0_8px_#00FFB2]',
    disconnected: 'bg-put-red shadow-[0_0_8px_#FF4757]',
    connecting: 'bg-yellow-500 shadow-[0_0_8px_#EAB308]'
  };

  return (
    <div className={`w-2 h-2 rounded-full ${colors[status]} animate-pulse`} />
  );
};
