import React from 'react';

interface ProgressBarProps {
  value: number;
  limit: number;
  theme?: 'light' | 'dark';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, limit, theme = 'light' }) => {
  const percentage = limit > 0 ? (value / limit) * 100 : 0;
  const isOverLimit = percentage > 100;
  
  // Menentukan warna progress bar berdasarkan persentase
  const barColor = isOverLimit 
    ? 'bg-red-500' 
    : percentage > 75 
    ? 'bg-yellow-500' 
    : 'bg-gradient-to-r from-brand-primary to-teal-500';

  const primaryTextColor = theme === 'dark' ? 'text-white/90' : 'text-gray-700';
  const secondaryTextColor = theme === 'dark' ? 'text-white/70' : 'text-gray-500';
  const barBackgroundColor = theme === 'dark' ? 'bg-white/20' : 'bg-gray-200';

  return (
    <div className="w-full">
        <div className="flex justify-between items-center mb-1">
            <span className={`text-xs font-semibold ${primaryTextColor}`}>
                {value} / {limit}
            </span>
            <span className={`text-xs font-semibold ${secondaryTextColor}`}>
                {Math.round(percentage)}%
            </span>
        </div>
        <div className={`w-full ${barBackgroundColor} rounded-full h-2.5`}>
            <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
        </div>
    </div>
  );
};

export default ProgressBar;