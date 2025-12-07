import React from 'react';
import { PremiumDonutChart } from './ChartComponents';

interface Props {
  data: { name: string; value: number }[];
}

const CategoryChart: React.FC<Props> = ({ data }) => {
  // Paleta kolorów dopasowana do ciemnego motywu
  const colors = ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#6366f1'];

  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <PremiumDonutChart 
        data={data} 
        dataKey="value" 
        categoryKey="name"
        colors={colors}
        height={300}
      />
    </div>
  );
};

export default CategoryChart;