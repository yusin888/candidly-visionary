
import { useEffect, useRef } from 'react';
import { 
  Bar, 
  BarChart as RechartBarChart, 
  CartesianGrid, 
  Cell, 
  Legend, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { AnalyticsData } from '@/lib/data';
import { cn } from '@/lib/utils';

type ChartType = 'bar' | 'line' | 'pie';

interface AnalyticsChartProps {
  title: string;
  data: any[];
  type: ChartType;
  className?: string;
  dataKey?: string;
  nameKey?: string;
  multiSeries?: boolean;
  seriesKeys?: string[];
  colors?: string[];
}

const defaultColors = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899'  // pink
];

const AnalyticsChart = ({ 
  title, 
  data, 
  type, 
  className, 
  dataKey = 'value',
  nameKey = 'label',
  multiSeries = false,
  seriesKeys = [],
  colors = defaultColors 
}: AnalyticsChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const animateChart = () => {
      if (chartRef.current) {
        chartRef.current.classList.add('animate-fade-in');
      }
    };
    
    animateChart();
    
    return () => {
      if (chartRef.current) {
        chartRef.current.classList.remove('animate-fade-in');
      }
    };
  }, [data]);
  
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RechartBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey={nameKey} 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', 
                  border: 'none' 
                }} 
              />
              {multiSeries ? (
                seriesKeys.map((key, index) => (
                  <Bar 
                    key={key} 
                    dataKey={key} 
                    fill={colors[index % colors.length]} 
                    radius={[4, 4, 0, 0]} 
                    animationDuration={1500}
                  />
                ))
              ) : (
                <Bar 
                  dataKey={dataKey} 
                  fill={colors[0]} 
                  radius={[4, 4, 0, 0]} 
                  animationDuration={1500}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
                  ))}
                </Bar>
              )}
              {multiSeries && <Legend />}
            </RechartBarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey={nameKey} 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB', strokeWidth: 1 }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', 
                  border: 'none' 
                }} 
              />
              {multiSeries ? (
                seriesKeys.map((key, index) => (
                  <Line 
                    key={key} 
                    type="monotone" 
                    dataKey={key} 
                    stroke={colors[index % colors.length]} 
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1500}
                  />
                ))
              ) : (
                <Line 
                  type="monotone" 
                  dataKey={dataKey} 
                  stroke={colors[0]} 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                />
              )}
              {multiSeries && <Legend />}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey={dataKey}
                nameKey={nameKey}
                animationDuration={1500}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || colors[index % colors.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', 
                  border: 'none' 
                }} 
                formatter={(value, name) => [`${value}`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className={cn("glass-card p-6", className)} ref={chartRef}>
      <h3 className="text-lg font-medium mb-6">{title}</h3>
      {renderChart()}
    </div>
  );
};

export default AnalyticsChart;
