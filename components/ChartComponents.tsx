import React, { useId } from 'react';
import { 
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, 
  ResponsiveContainer, Tooltip, XAxis, YAxis 
} from 'recharts';

// --- 1. BEZPIECZNY TOOLTIP ---
export const CustomTooltip = ({ active, payload, label, valueFormatter }: any) => {
  if (active && payload && payload.length > 0) {
    const value = payload[0].value;
    // Zabezpieczenie przed wartościami undefined/null
    const formattedValue = valueFormatter 
      ? valueFormatter(value) 
      : (typeof value === 'number' ? value.toLocaleString() : value);
    
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl min-w-[120px] z-50">
        <p className="text-slate-400 text-xs mb-1 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-white font-bold text-lg font-sans">
          {formattedValue}
        </p>
      </div>
    );
  }
  return null;
};

// --- 2. WYKRES LINIOWY / OBSZAROWY ---
interface AreaProps {
  data: any[];
  dataKey: string;
  categoryKey?: string;
  color?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
}

export const PremiumAreaChart: React.FC<AreaProps> = ({ 
  data = [], dataKey, categoryKey = "name", color = "#8b5cf6", height = 300, valueFormatter 
}) => {
  // Generujemy unikalne ID dla gradientu, żeby wykresy się nie gryzły
  const gradientId = useId().replace(/:/g, ''); 

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500 text-sm">Brak danych do wyświetlenia</div>;
  }

  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey={categoryKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            dy={10}
            minTickGap={30}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            tickFormatter={valueFormatter}
            width={40}
          />
          <Tooltip 
            content={<CustomTooltip valueFormatter={valueFormatter} />} 
            cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' }} 
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={3}
            fillOpacity={1} 
            fill={`url(#${gradientId})`} 
            activeDot={{ r: 6, strokeWidth: 0, fill: '#fff', stroke: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- 3. WYKRES SŁUPKOWY ---
interface BarProps extends AreaProps {}

export const PremiumBarChart: React.FC<BarProps> = ({ 
  data = [], dataKey, categoryKey = "name", color = "#3b82f6", height = 300, valueFormatter 
}) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500 text-sm">Brak danych</div>;
  }

  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey={categoryKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            tickFormatter={valueFormatter}
            width={40}
          />
          <Tooltip 
            content={<CustomTooltip valueFormatter={valueFormatter} />} 
            cursor={{ fill: '#1e293b', opacity: 0.4 }} 
          />
          <Bar 
            dataKey={dataKey} 
            fill={color} 
            radius={[4, 4, 0, 0]} 
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- 4. WYKRES KOŁOWY ---
interface DonutProps {
  data: any[];
  dataKey: string;
  categoryKey?: string;
  colors?: string[];
  height?: number;
}

const DEFAULT_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const PremiumDonutChart: React.FC<DonutProps> = ({ 
  data = [], dataKey, categoryKey = "name", colors = DEFAULT_COLORS, height = 300 
}) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500 text-sm">Brak danych</div>;
  }

  return (
    <div style={{ width: '100%', height: height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey={dataKey}
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
             content={({ active, payload }) => {
               if (active && payload && payload.length) {
                 const item = payload[0].payload;
                 return (
                   <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl z-50">
                     <p className="text-white font-bold">{item[categoryKey]}</p>
                     <p className="text-slate-400 text-sm">{item[dataKey]} szt.</p>
                   </div>
                 );
               }
               return null;
             }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};