import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { NutritionData } from '../types';

interface NutritionChartProps {
  data: NutritionData;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b']; // Emerald, Blue, Amber

const NutritionChart: React.FC<NutritionChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Proteína', value: data.protein },
    { name: 'Carbos', value: data.carbs },
    { name: 'Grasa', value: data.fat },
  ];

  return (
    <div className="h-48 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
                backgroundColor: '#1e1033', 
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                color: '#fff'
            }}
            itemStyle={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 500 }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center Label */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <p className="text-xs text-gray-400 uppercase tracking-wider">Calorías</p>
        <p className="text-xl font-bold text-white">{data.calories}</p>
      </div>
    </div>
  );
};

export default NutritionChart;