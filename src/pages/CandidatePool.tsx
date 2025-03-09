
import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import CandidateTable from '@/components/dashboard/CandidateTable';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Filter, 
  Users, 
  Plus, 
  Search,
  SlidersHorizontal,
  RefreshCcw
} from 'lucide-react';
import { candidates } from '@/lib/data';

const CandidatePool = () => {
  const [view, setView] = useState<'all' | 'active' | 'hired' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter candidates based on view and search query
  const filteredCandidates = candidates.filter(candidate => {
    // Filter by status
    if (view === 'active' && (candidate.status === 'hired' || candidate.status === 'rejected')) {
      return false;
    }
    if (view === 'hired' && candidate.status !== 'hired') {
      return false;
    }
    if (view === 'rejected' && candidate.status !== 'rejected') {
      return false;
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        candidate.name.toLowerCase().includes(query) ||
        candidate.role.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Count candidates in each category
  const counts = {
    all: candidates.length,
    active: candidates.filter(c => c.status !== 'hired' && c.status !== 'rejected').length,
    hired: candidates.filter(c => c.status === 'hired').length,
    rejected: candidates.filter(c => c.status === 'rejected').length
  };

  return (
    <MainLayout>
      <Header 
        title="Candidate Pool" 
        subtitle="Manage and track candidates throughout the recruitment process"
      />
      
      <div className="grid gap-6">
        {/* Action Bar */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search candidates..."
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Sort
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
            <TabsTrigger value="all" onClick={() => setView('all')}>
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="active" onClick={() => setView('active')}>
              Active ({counts.active})
            </TabsTrigger>
            <TabsTrigger value="hired" onClick={() => setView('hired')}>
              Hired ({counts.hired})
            </TabsTrigger>
            <TabsTrigger value="rejected" onClick={() => setView('rejected')}>
              Rejected ({counts.rejected})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <CandidateTable candidates={filteredCandidates} />
          </TabsContent>
          <TabsContent value="active">
            <CandidateTable candidates={filteredCandidates} />
          </TabsContent>
          <TabsContent value="hired">
            <CandidateTable candidates={filteredCandidates} />
          </TabsContent>
          <TabsContent value="rejected">
            <CandidateTable candidates={filteredCandidates} />
          </TabsContent>
        </Tabs>
        
        {/* Last Updated Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Last updated: Today at 10:42 AM</span>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <RefreshCcw className="h-3 w-3" />
            Refresh
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CandidatePool;
