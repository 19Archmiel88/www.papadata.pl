import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KPIData } from '../types';

interface Props {
  data: KPIData;
}

const KPICard: React.FC<Props> = ({ data }) => {
  const isNeutral = data.change === 0;
  const isPositive = data.change > 0;
  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const trendColor = isNeutral ? 'text-slate-400' : isPositive ? 'text-emerald-500' : 'text-rose-500';

  const formattedValue = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: data.value % 1 !== 0 ? 1 : 0,
  }).format(data.value);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm relative group hover:border-indigo-500/30 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {data.label}
        </p>
        <div className={`flex items-center gap-1 text-xs font-bold ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          <span>{isPositive ? '+' : ''}{data.change}%</span>
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 flex-wrap">
        {data.prefix && (
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{data.prefix}</span>
        )}
        <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {formattedValue}
        </span>
        {data.suffix && (
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{data.suffix}</span>
        )}
      </div>

      <p className="text-[10px] text-slate-400 mt-2 font-medium">vs previous period</p>
    </div>
  );
};

export default KPICard;
