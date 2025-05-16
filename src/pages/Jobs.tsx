
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Plus, RefreshCcw, Search, SlidersHorizontal, Trash } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Mock data (will be replaced by API call)
const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    usesMultipleHR: true,
    createdAt: new Date(2023, 4, 15),
    criteria: [
      { name: 'React Experience', weight: 0.4, description: 'Experience with React and related ecosystem' },
      { name: 'UI/UX Skills', weight: 0.3, description: 'Ability to implement beautiful and functional interfaces' },
      { name: 'Problem Solving', weight: 0.3, description: 'Ability to solve complex technical problems' },
    ]
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'San Francisco, CA',
    usesMultipleHR: false,
    createdAt: new Date(2023, 5, 20),
    criteria: [
      { name: 'Product Strategy', weight: 0.5, description: 'Experience developing product strategy' },
      { name: 'Technical Background', weight: 0.3, description: 'Understanding of technical concepts' },
      { name: 'Communication', weight: 0.2, description: 'Excellent written and verbal communication' },
    ]
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'New York, NY',
    usesMultipleHR: true,
    createdAt: new Date(2023, 6, 10),
    criteria: [
      { name: 'Cloud Infrastructure', weight: 0.4, description: 'Experience with AWS/Azure/GCP' },
      { name: 'CI/CD', weight: 0.3, description: 'Experience with CI/CD pipelines' },
      { name: 'Security', weight: 0.3, description: 'Knowledge of security best practices' },
    ]
  },
];

// This will be replaced by an API call in the future
const fetchJobs = async () => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockJobs);
    }, 500);
  }).then(res => res);
};

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Replace with real API call using React Query
  const { data: jobs = [], isLoading, error, refetch } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const filteredJobs = jobs.filter((job: any) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate(`/jobs/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    // This would be replaced with an API call to delete the job
    toast({
      title: "Job deleted",
      description: "The job has been successfully deleted.",
    });
  };

  const handleNewJob = () => {
    navigate('/jobs/new');
  };

  if (error) {
    return (
      <MainLayout>
        <Header 
          title="Jobs" 
          subtitle="Manage job postings and evaluation criteria"
        />
        <div className="text-center p-8">
          <p className="text-destructive mb-4">Error loading jobs. Please try again later.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header 
        title="Jobs" 
        subtitle="Manage job postings and evaluation criteria"
      />

      <div className="grid gap-6">
        {/* Action Bar */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs..."
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" onClick={handleNewJob}>
                <Plus className="h-4 w-4 mr-2" />
                New Job
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Jobs Table */}
        <Card>
          <Table>
            <TableCaption>List of all job postings</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Multiple HR</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading jobs...</TableCell>
                </TableRow>
              ) : filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    {searchQuery ? "No jobs match your search." : "No jobs found. Create your first job."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job: any) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.department}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.usesMultipleHR ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(job.createdAt, { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(job.id)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(job.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {filteredJobs.length > 0 && (
            <div className="p-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>
        
        {/* Last Updated Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Last updated: Today at {new Date().toLocaleTimeString()}</span>
          <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => refetch()}>
            <RefreshCcw className="h-3 w-3" />
            Refresh
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Jobs;
