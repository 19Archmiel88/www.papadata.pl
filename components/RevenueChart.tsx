import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { ChartDataPoint } from '../types';

interface Props {
  data: ChartDataPoint[];
}

const RevenueChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(value) => `PLN ${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(30, 41, 59, 0.95)',
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#f8fafc',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            itemStyle={{ color: '#e2e8f0' }}
            formatter={(value: number) => [`PLN ${value.toLocaleString()}`, undefined]}
            labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem' }}
            cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="Revenue"
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
          />
          <Area
            type="monotone"
            dataKey="spend"
            stroke="#f43f5e"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSpend)"
            name="Spend"
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
          />
          <Brush dataKey="date" height={30} stroke="#6366f1" fill="#f1f5f9" tickFormatter={() => ''} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
