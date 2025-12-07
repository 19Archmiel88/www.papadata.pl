import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';

interface Props {
  data: { date: string; value: number }[];
}

const RevenueChart: React.FC<Props> = ({ data }) => {
  // Dane testowe na wypadek braku propsów
  const safeData = (data && data.length > 0) 
    ? data 
    : [
        { date: 'Test A', value: 1000 }, 
        { date: 'Test B', value: 2500 }, 
        { date: 'Test C', value: 1500 }
      ];

  return (
    <div className="flex items-center justify-center w-full h-[300px] bg-slate-500/5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 overflow-hidden">
      {/* Usunąłem ResponsiveContainer, dałem sztywne wymiary */}
      <AreaChart
        width={500}
        height={250}
        data={safeData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorRevenueFixed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" opacity={0.2} />
        
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
          width={40}
        />
        
        <Tooltip />
        
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="#8b5cf6" 
          strokeWidth={3} 
          fillOpacity={1} 
          fill="url(#colorRevenueFixed)" 
        />
      </AreaChart>
    </div>
  );
};

export default RevenueChart;