
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import StatCard from '@/components/dashboard/StatCard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  Clock, 
  TrendingUp,
  Calendar
} from 'lucide-react';
import { 
  roleDistribution, 
  experienceDistribution, 
  scoresOverTime
} from '@/lib/data';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  // Analytics summary stats
  const analyticsStats = [
    { title: 'Total Applicants', value: '843', icon: Users, trend: { value: 12, positive: true } },
    { title: 'Avg. Time to Hire', value: '18 days', icon: Clock, trend: { value: 5, positive: false } },
    { title: 'Conversion Rate', value: '8.2%', icon: TrendingUp, trend: { value: 3, positive: true } },
    { title: 'Open Positions', value: '24', icon: Calendar, trend: { value: 2, positive: true } },
  ];

  return (
    <MainLayout>
      <Header 
        title="Analytics" 
        subtitle="Track recruitment performance and candidate metrics"
      />
      
      <div className="grid gap-6">
        {/* Time range selector */}
        <Card className="p-4">
          <Tabs defaultValue="month" className="w-full">
            <TabsList className="grid grid-cols-4 w-full sm:w-80">
              <TabsTrigger value="week" onClick={() => setTimeRange('week')}>Week</TabsTrigger>
              <TabsTrigger value="month" onClick={() => setTimeRange('month')}>Month</TabsTrigger>
              <TabsTrigger value="quarter" onClick={() => setTimeRange('quarter')}>Quarter</TabsTrigger>
              <TabsTrigger value="year" onClick={() => setTimeRange('year')}>Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsChart
            title="Role Distribution"
            data={roleDistribution}
            type="pie"
          />
          
          <AnalyticsChart
            title="Experience Distribution"
            data={experienceDistribution}
            type="bar"
          />
        </div>
        
        <AnalyticsChart
          title="Candidate Scores Over Time"
          data={scoresOverTime}
          type="line"
          multiSeries={true}
          seriesKeys={['education', 'softSkills', 'technical']}
          nameKey="month"
        />
        
        {/* Additional metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Diversity Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Gender Diversity</span>
                  <span className="text-sm font-medium">64%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '64%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Ethnic Diversity</span>
                  <span className="text-sm font-medium">58%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Age Distribution</span>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Recruitment Efficiency</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Time in Initial Screening</span>
                  <span className="text-sm font-medium">2.3 days</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Time in Technical Assessment</span>
                  <span className="text-sm font-medium">5.7 days</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Time in Final Decision</span>
                  <span className="text-sm font-medium">3.8 days</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
