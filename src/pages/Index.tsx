
import { BarChart3, BriefcaseIcon, CheckCircle, Clock, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import CandidateTable from '@/components/dashboard/CandidateTable';
import PipelineChart from '@/components/dashboard/PipelineChart';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { candidates, dashboardStats, insights, pipelineData, roleDistribution } from '@/lib/data';

const Index = () => {
  return (
    <MainLayout>
      <Header 
        title="Dashboard" 
        subtitle="Welcome back to CandidAI. Here's what's happening today." 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Candidates" 
          value="245" 
          icon={Users} 
          trend={{ value: 12, positive: true }}
        />
        <StatCard 
          title="Open Positions" 
          value="12" 
          icon={BriefcaseIcon} 
        />
        <StatCard 
          title="Final Stage" 
          value="24" 
          icon={CheckCircle} 
          trend={{ value: 8, positive: true }}
        />
        <StatCard 
          title="Avg. Time to Hire" 
          value="18 days" 
          icon={Clock} 
          trend={{ value: 3, positive: false }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <PipelineChart data={pipelineData} className="lg:col-span-2" />
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">Latest Insights</h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground mt-0.5">
                  <BarChart3 className="h-3 w-3" />
                </div>
                <p className="text-sm flex-1">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4">Recent Candidates</h3>
        <CandidateTable candidates={candidates.slice(0, 5)} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalyticsChart 
          title="Role Distribution" 
          data={roleDistribution} 
          type="pie" 
        />
        <AnalyticsChart 
          title="Score Breakdown" 
          data={candidates.slice(0, 5).map(c => ({
            name: c.name.split(' ')[0],
            education: c.educationScore,
            soft: c.softSkillsScore,
            technical: c.technicalScore
          }))} 
          type="bar" 
          nameKey="name"
          multiSeries={true}
          seriesKeys={['education', 'soft', 'technical']}
        />
      </div>
    </MainLayout>
  );
};

export default Index;
