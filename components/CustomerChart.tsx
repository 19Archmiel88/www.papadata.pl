import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CustomerData } from '../types';

interface Props {
  data: CustomerData[];
  title: string;
}

const CustomerChart: React.FC<Props> = ({ data, title }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              dy={10}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#f8fafc',
                backdropFilter: 'blur(8px)',
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-slate-500 dark:text-slate-400 text-xs font-medium ml-1">{value}</span>
              )}
            />
            <Bar dataKey="newCustomers" name="New" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} />
            <Bar dataKey="returningCustomers" name="Returning" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerChart;
