import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CategoryData } from '../types';

interface Props {
  data: CategoryData[];
  title: string;
  subtitle?: string;
}

const CategoryChart: React.FC<Props> = ({ data, title, subtitle }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{subtitle}</p>}
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#f8fafc',
                backdropFilter: 'blur(8px)',
              }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: number) => `${value}%`}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium ml-1">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;
