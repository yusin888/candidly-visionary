
import { PipelineStage } from '@/lib/data';
import { cn } from '@/lib/utils';

interface PipelineChartProps {
  data: PipelineStage[];
  className?: string;
}

const PipelineChart = ({ data, className }: PipelineChartProps) => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-emerald-500'
  ];
  
  return (
    <div className={cn("glass-card p-6", className)}>
      <h3 className="text-lg font-medium mb-6">Recruitment Pipeline</h3>
      
      <div className="space-y-6">
        <div className="relative h-12 flex rounded-lg overflow-hidden">
          {data.map((stage, index) => (
            <div
              key={stage.name}
              className={cn(
                "h-full flex items-center justify-center text-white font-medium transition-all duration-500 ease-in-out",
                colors[index % colors.length]
              )}
              style={{
                width: `${stage.percentage}%`,
                clipPath: index === data.length - 1 
                  ? 'none' 
                  : 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)'
              }}
            >
              <span className="text-sm truncate px-2">
                {stage.count}
              </span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {data.map((stage, index) => (
            <div key={stage.name} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div 
                  className={cn(
                    "w-4 h-4 rounded-full mr-2",
                    colors[index % colors.length]
                  )}
                ></div>
                <span className="text-sm font-medium">{stage.name}</span>
              </div>
              <div className="text-2xl font-semibold">{stage.count}</div>
              <div className="text-sm text-muted-foreground">
                {stage.percentage}% of total
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PipelineChart;
