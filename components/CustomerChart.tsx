import React from 'react';
import { PremiumBarChart } from './ChartComponents';

interface Props {
  data: { name: string; customers: number }[];
}

const CustomerChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <PremiumBarChart 
        data={data} 
        dataKey="customers" 
        categoryKey="name" 
        color="#3b82f6" 
        height={300}
        valueFormatter={(value) => (value || 0).toString()}
      />
    </div>
  );
};

export default CustomerChart;