
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import PipelineChart from '@/components/dashboard/PipelineChart';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, Settings } from 'lucide-react';
import { pipelineData, candidates } from '@/lib/data';

const Pipeline = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [jobCategory, setJobCategory] = useState<'all' | 'engineering' | 'design' | 'product'>('all');
  
  // Calculate stage conversion rates
  const calculateConversionRates = () => {
    const result = [];
    for (let i = 1; i < pipelineData.length; i++) {
      const previousStage = pipelineData[i-1];
      const currentStage = pipelineData[i];
      const rate = previousStage.count > 0 
        ? Math.round((currentStage.count / previousStage.count) * 100) 
        : 0;
      
      result.push({
        from: previousStage.name,
        to: currentStage.name,
        rate: rate,
        count: currentStage.count
      });
    }
    return result;
  };
  
  const conversionRates = calculateConversionRates();
  
  // Calculate average time in each stage (mock data)
  const stageTimeData = [
    { stage: 'Initial Filtering', time: '2.3 days', color: 'bg-blue-500' },
    { stage: 'Soft Skills Evaluation', time: '3.1 days', color: 'bg-purple-500' },
    { stage: 'Detailed Scoring', time: '4.5 days', color: 'bg-yellow-500' },
    { stage: 'Final Ranking', time: '2.8 days', color: 'bg-green-500' },
    { stage: 'Hiring Decision', time: '1.7 days', color: 'bg-emerald-500' }
  ];
  
  // Mock bottlenecks data
  const bottlenecks = [
    { 
      stage: 'Soft Skills Evaluation', 
      count: 12, 
      description: 'Candidates waiting > 5 days',
      impact: 'high'
    },
    { 
      stage: 'Detailed Scoring', 
      count: 8, 
      description: 'Technical assessment pending',
      impact: 'medium'
    }
  ];

  return (
    <MainLayout>
      <Header 
        title="Pipeline Overview" 
        subtitle="Track candidates through the recruitment stages"
      />
      
      <div className="grid gap-6">
        {/* Filters and controls */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Tabs defaultValue="month" className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-3 w-full sm:w-80">
                <TabsTrigger value="week" onClick={() => setTimeRange('week')}>Week</TabsTrigger>
                <TabsTrigger value="month" onClick={() => setTimeRange('month')}>Month</TabsTrigger>
                <TabsTrigger value="quarter" onClick={() => setTimeRange('quarter')}>Quarter</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select defaultValue="all" onValueChange={(value: any) => setJobCategory(value)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Job Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Pipeline visualization */}
        <PipelineChart data={pipelineData} />
        
        {/* Conversion rates */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Stage Conversion Rates</h3>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Detailed Reports
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {conversionRates.map((item, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <span>{item.from}</span>
                  <svg className="h-4 w-4 mx-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{item.to}</span>
                </div>
                <div className="text-2xl font-semibold">{item.rate}%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {item.count} candidates passed
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-4">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${item.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Time per stage + bottlenecks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Average time in each stage */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-6">Average Time per Stage</h3>
            <div className="space-y-6">
              {stageTimeData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                      <span className="text-sm">{item.stage}</span>
                    </div>
                    <span className="text-sm font-medium">{item.time}</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div 
                      className={item.color}
                      style={{ width: `${(parseFloat(item.time) / 5) * 100}%`, height: '100%', borderRadius: '9999px' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Pipeline bottlenecks */}
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-6">Pipeline Bottlenecks</h3>
            {bottlenecks.length > 0 ? (
              <div className="space-y-4">
                {bottlenecks.map((item, index) => (
                  <div key={index} className="flex items-start p-4 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      item.impact === 'high' ? 'bg-red-500' :
                      item.impact === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    } mr-3`}></div>
                    <div>
                      <div className="font-medium">{item.stage}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                      <div className="text-sm font-medium mt-1">{item.count} candidates affected</div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2">View All Issues</Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-muted-foreground">No bottlenecks detected</div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pipeline;
