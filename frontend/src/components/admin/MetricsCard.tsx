import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color?: 'primary' | 'secondary' | 'emerald' | 'amber';
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
}) => {
  const colorStyles = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  }[color];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-black text-slate-900 tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
        )}
      </div>

      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorStyles}`}
      >
        <span className="material-symbols-outlined text-[26px]">{icon}</span>
      </div>
    </div>
  );
};
