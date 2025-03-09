
import Header from '@/components/layout/Header';
import MainLayout from '@/components/layout/MainLayout';
import PipelineChart from '@/components/dashboard/PipelineChart';
import { pipelineData, candidates } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CandidateTable from '@/components/dashboard/CandidateTable';

const Pipeline = () => {
  // Group candidates by status
  const candidatesByStatus = {
    initial: candidates.filter(c => c.status === 'initial'),
    soft_skills: candidates.filter(c => c.status === 'soft_skills'),
    detailed_scoring: candidates.filter(c => c.status === 'detailed_scoring'),
    final_ranking: candidates.filter(c => c.status === 'final_ranking'),
    hired: candidates.filter(c => c.status === 'hired'),
    rejected: candidates.filter(c => c.status === 'rejected')
  };
  
  return (
    <MainLayout>
      <Header 
        title="Pipeline Overview" 
        subtitle="Track candidate progress through the recruitment pipeline" 
      />
      
      <Card className="p-6 mb-8 glass-card">
        <h3 className="text-lg font-medium mb-6">Pipeline Visualization</h3>
        <PipelineChart data={pipelineData} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
          <div className="p-4 bg-blue-100 rounded-lg">
            <div className="text-sm text-blue-800 font-medium">Conversion Rate</div>
            <div className="text-xl font-semibold">70%</div>
            <div className="text-xs text-blue-600">Initial → Soft Skills</div>
          </div>
          <div className="p-4 bg-purple-100 rounded-lg">
            <div className="text-sm text-purple-800 font-medium">Conversion Rate</div>
            <div className="text-xl font-semibold">62%</div>
            <div className="text-xs text-purple-600">Soft Skills → Detailed</div>
          </div>
          <div className="p-4 bg-yellow-100 rounded-lg">
            <div className="text-sm text-yellow-800 font-medium">Conversion Rate</div>
            <div className="text-xl font-semibold">46%</div>
            <div className="text-xs text-yellow-600">Detailed → Final</div>
          </div>
          <div className="p-4 bg-green-100 rounded-lg">
            <div className="text-sm text-green-800 font-medium">Conversion Rate</div>
            <div className="text-xl font-semibold">58%</div>
            <div className="text-xs text-green-600">Final → Hired</div>
          </div>
          <div className="p-4 bg-emerald-100 rounded-lg">
            <div className="text-sm text-emerald-800 font-medium">Overall Success</div>
            <div className="text-xl font-semibold">12%</div>
            <div className="text-xs text-emerald-600">Initial → Hired</div>
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 glass-card bg-transparent">
          <TabsTrigger value="all">All Stages</TabsTrigger>
          <TabsTrigger value="initial">Initial Filtering</TabsTrigger>
          <TabsTrigger value="soft_skills">Soft Skills</TabsTrigger>
          <TabsTrigger value="detailed_scoring">Detailed Scoring</TabsTrigger>
          <TabsTrigger value="final_ranking">Final Ranking</TabsTrigger>
          <TabsTrigger value="hired">Hired</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <CandidateTable candidates={candidates} />
        </TabsContent>
        
        <TabsContent value="initial">
          <CandidateTable candidates={candidatesByStatus.initial} />
        </TabsContent>
        
        <TabsContent value="soft_skills">
          <CandidateTable candidates={candidatesByStatus.soft_skills} />
        </TabsContent>
        
        <TabsContent value="detailed_scoring">
          <CandidateTable candidates={candidatesByStatus.detailed_scoring} />
        </TabsContent>
        
        <TabsContent value="final_ranking">
          <CandidateTable candidates={candidatesByStatus.final_ranking} />
        </TabsContent>
        
        <TabsContent value="hired">
          <CandidateTable candidates={candidatesByStatus.hired} />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Pipeline;
