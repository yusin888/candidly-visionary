import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import CandidateTable from '@/components/dashboard/CandidateTable';
import AddCandidateModal from '@/components/candidates/AddCandidateModal';
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
import { Candidate, statusColors, statusLabels } from '@/lib/data';

// Unified ApiCandidate Interface (should match CandidateProfile.tsx)
interface ApiCandidate {
  _id: string; // Mapped from 'id'
  id?: string; // Original id from API

  firstName: string;
  lastName: string;
  name?: string; // Optional, as firstName and lastName are primary
  email: string;
  phone: string;

  role?: string; // From root of API response for both list and single
  experience?: number; // From root of API response, e.g., 0.4
  status: string; // From root, e.g., "applied"
  displayStatus?: string; // from /api/candidates list
  
  initialScore?: number; // From root of API responses
  confidenceScore?: number; // From root of API responses
  score?: number; // From /api/candidates list (might be same as initialScore)

  // scores object from /:id response (less likely in list view)
  scores?: {
    education?: number; 
    technical?: number; 
    final?: number;     
  };

  // Dates: API list uses 'applied', API /:id uses 'appliedOn'. Unify to 'appliedDate'.
  appliedDate?: string; 

  resume?: string; // Path, mainly from /:id, might not be in list

  attributes?: { // From /:id, might be partial or absent in list
    [key: string]: boolean | number | string | undefined;
    yearsOfExperience?: number; 
    education_level?: string;
    // ... other specific attributes from /:id example
  };

  stages?: { // From both, list view seems to only have 'completed'
    phoneScreen?: { completed: boolean; score?: number; notes?: string };
    codingInterview?: { completed: boolean; score?: number; notes?: string };
    onsiteInterview?: { completed: boolean; score?: number; notes?: string };
  };

  // parsedResume can be in both list and /:id
  parsedResume?: {
    Certification?: string[];
    "Education Details"?: Array<{
      "date completed"?: string;
      "education level"?: string;
      "field of study"?: string;
      "grade level"?: string;
      institution?: string;
    }>;
    Email?: string;
    "Experience Details"?: Array<{
      "Industry Name"?: string;
      "Roles"?: string;
    }>;
    "Experience level"?: string;
    "Job Role"?: string;
    Name?: string;
    Phone?: string;
    Skills?: string[];
    "Social Media"?: string[];
    "Total Estimated Years of Experience"?: string;
    rawResumeText?: string;
  };
  
  // From /api/candidates list specifically
  experienceDetails?: Array<{
      "Industry Name"?: string;
      "Roles"?: string;
  }>;
  statusCounts?: { 
    all?: number;
    active?: number;
    hired?: number;
    rejected?: number;
  };

  // From /:id specifically
  keySkills?: string[];
  finalRanking?: boolean;
}

const CandidatePool = () => {
  const [view, setView] = useState<'all' | 'active' | 'hired' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiCandidates, setApiCandidates] = useState<ApiCandidate[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://scoring-and-ranking.vercel.app/api/candidates');
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      const data = await response.json();
      console.log('Raw API response from /api/candidates:', JSON.stringify(data, null, 2));
      
      const processedData: ApiCandidate[] = data.map((candidate: any) => ({
        ...candidate,
        _id: candidate.id || candidate._id, // Ensure _id for internal use
        appliedDate: candidate.applied || candidate.appliedOn, // Unify date field
        // Ensure numbers are numbers, not strings, if API is inconsistent
        initialScore: candidate.initialScore !== undefined ? parseFloat(candidate.initialScore) : undefined,
        experience: candidate.experience !== undefined ? parseFloat(candidate.experience) : undefined,
      }));
      
      setApiCandidates(processedData);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error fetching candidates:', error);
      // TODO: Set an error state to display to the user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const getRoleFromApiCandidate = (candidate: ApiCandidate): string => {
    if (candidate.role) return candidate.role;
    // Basic attribute check, assuming attributes might be simpler in list view
    if (candidate.attributes) {
        const attrs = candidate.attributes;
        if ((attrs.react_js === true || attrs.react === true) && (attrs.javascript === true || attrs.js === true)) return "Frontend Developer";
        if ((attrs.node_js === true || attrs.nodejs === true)) return "Backend Developer";
    }
    // Fallback if no specific role info in list item
    return candidate.parsedResume?.["Job Role"] || "Software Engineer"; 
  };

  const mappedCandidates: Candidate[] = apiCandidates.map(candidate => {
    let uiStatus: Candidate['status'] = 'initial';
    switch(candidate.status?.toLowerCase()) {
      case 'applied':
      case 'screening':
        uiStatus = 'initial';
        break;
      case 'interviewing':
        uiStatus = 'detailed_scoring';
        break;
      case 'hired':
        uiStatus = 'hired';
        break;
      case 'rejected':
        uiStatus = 'rejected';
        break;
      default:
        uiStatus = 'initial';
    }
    
    // Scores for table - may be limited by list API data
    const initialScorePercent = candidate.initialScore ? parseFloat((candidate.initialScore * 100).toFixed(2)) : 0;
    // Other scores like soft skills, technical are not directly in list API sample.
    // The `Candidate` type for the table expects them. We'll default to 0 or map if available.
    const softSkillsScore = candidate.stages?.phoneScreen?.score ? Math.round(candidate.stages.phoneScreen.score * 100) : 0;
    const technicalScore = candidate.stages?.codingInterview?.score ? Math.round(candidate.stages.codingInterview.score * 100) : 
                          (candidate.scores?.technical ?? 0); // Fallback to scores.technical if present
    const finalScore = candidate.scores?.final ?? 0;
    const educationScore = candidate.scores?.education ?? 0;

    return {
      id: candidate._id, // Use the processed _id
      name: `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim(),
      role: getRoleFromApiCandidate(candidate),
      status: uiStatus,
      experience: candidate.experience ?? 0, // Use root experience
      
      // Pass initialScorePercent as the main 'score' for the table's progress bar
      score: initialScorePercent, 

      // Keep other specific scores if CandidateTable or Candidate type uses them separately
      educationScore: educationScore, 
      softSkillsScore: softSkillsScore, 
      technicalScore: technicalScore, 
      finalScore: finalScore, 
      
      applied: candidate.appliedDate ? new Date(candidate.appliedDate).toLocaleDateString() : 'N/A',
      lastUpdated: candidate.appliedDate ? new Date(candidate.appliedDate).toLocaleDateString() : 'N/A', // Or a more specific field if API provides
    };
  });
  
  const filteredCandidates = mappedCandidates.filter(candidateInTableFormat => {
    if (view === 'active' && (candidateInTableFormat.status === 'hired' || candidateInTableFormat.status === 'rejected')) {
      return false;
    }
    if (view === 'hired' && candidateInTableFormat.status !== 'hired') {
      return false;
    }
    if (view === 'rejected' && candidateInTableFormat.status !== 'rejected') {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        candidateInTableFormat.name.toLowerCase().includes(query) ||
        candidateInTableFormat.role.toLowerCase().includes(query)
      );
    }
    return true;
  });
  
  const counts = {
    all: apiCandidates.length, // Count based on raw API candidates before table mapping
    active: apiCandidates.filter(c => c.status !== 'hired' && c.status !== 'rejected').length,
    hired: apiCandidates.filter(c => c.status === 'hired').length,
    rejected: apiCandidates.filter(c => c.status === 'rejected').length
  };

  const handleRefreshCandidates = () => {
    fetchCandidates();
  };

  return (
    <MainLayout>
      <Header 
        title="Candidate Pool" 
        subtitle="Manage and track candidates throughout the recruitment process"
      />
      
      <div className="grid gap-6">
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
              <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </div>
          </div>
        </Card>
        
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
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Loading candidates...</p>
              </div>
            ) : (
              <CandidateTable candidates={filteredCandidates} />
            )}
          </TabsContent>
          <TabsContent value="active">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Loading candidates...</p>
              </div>
            ) : (
              <CandidateTable candidates={filteredCandidates} />
            )}
          </TabsContent>
          <TabsContent value="hired">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Loading candidates...</p>
              </div>
            ) : (
              <CandidateTable candidates={filteredCandidates} />
            )}
          </TabsContent>
          <TabsContent value="rejected">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Loading candidates...</p>
              </div>
            ) : (
              <CandidateTable candidates={filteredCandidates} />
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Last updated: {lastUpdated || 'Never'}</span>
          <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleRefreshCandidates}>
            <RefreshCcw className="h-3 w-3" />
            Refresh
          </Button>
        </div>

        <AddCandidateModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)}
          onCandidateAdded={handleRefreshCandidates}
        />
      </div>
    </MainLayout>
  );
};

export default CandidatePool;
