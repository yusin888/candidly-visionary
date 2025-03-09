
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon: Icon, trend, className }: StatCardProps) => {
  return (
    <div className={cn(
      "glass-card p-6 flex flex-col space-y-2 group hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="rounded-full p-2 bg-secondary/80 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-2xl font-semibold">{value}</div>
        
        {trend && (
          <div className={cn(
            "text-xs font-medium flex items-center",
            trend.positive ? "text-emerald-600" : "text-red-600"
          )}>
            <span className="mr-1">{trend.positive ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
