
import { useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronRight, 
  Download, 
  FileText, 
  Mail, 
  MessageSquare, 
  Phone, 
  Share2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/Header';
import MainLayout from '@/components/layout/MainLayout';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { candidates, statusLabels, timelineEvents } from '@/lib/data';
import { cn } from '@/lib/utils';

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const candidate = candidates.find(c => c.id === id);
  
  if (!candidate) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-medium mb-2">Candidate Not Found</h2>
          <p className="text-muted-foreground mb-6">The candidate you're looking for doesn't exist.</p>
          <Button asChild>
            <a href="/candidates"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Candidates</a>
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  const scoreData = [
    { name: 'Education', value: candidate.educationScore, color: '#3b82f6' },
    { name: 'Soft Skills', value: candidate.softSkillsScore, color: '#8b5cf6' },
    { name: 'Technical', value: candidate.technicalScore, color: '#10b981' }
  ];
  
  return (
    <MainLayout>
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild>
          <a href="/candidates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </a>
        </Button>
      </div>
      
      <div className="glass-card p-6 mb-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl font-semibold">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-semibold">{candidate.name}</h1>
              <div className="flex items-center text-muted-foreground">
                <span>{candidate.role}</span>
                <ChevronRight className="mx-1 h-4 w-4" />
                <span className="font-medium text-foreground">{statusLabels[candidate.status]}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="mr-2 h-4 w-4" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Experience</div>
            <div className="text-xl font-semibold">{candidate.experience} years</div>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Education Score</div>
            <div className="text-xl font-semibold">{candidate.educationScore}/100</div>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Technical Score</div>
            <div className="text-xl font-semibold">{candidate.technicalScore}/100</div>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Final Score</div>
            <div className="text-xl font-semibold">{candidate.finalScore}/100</div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="animate-fade-in">
        <TabsList className="mb-6 glass-card bg-transparent">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="notes">HR Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 md:col-span-2">
              <h3 className="text-lg font-medium mb-4">Candidate Summary</h3>
              <p className="text-muted-foreground mb-6">
                {candidate.name} is a {candidate.role} with {candidate.experience} years of experience.
                Currently in the {statusLabels[candidate.status].toLowerCase()} stage of the recruitment process.
                Applied on {new Date(candidate.applied).toLocaleDateString()}.
              </p>
              
              <h4 className="font-medium mb-2">Key Skills</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-secondary text-foreground text-sm">JavaScript</span>
                <span className="px-3 py-1 rounded-full bg-secondary text-foreground text-sm">React</span>
                <span className="px-3 py-1 rounded-full bg-secondary text-foreground text-sm">Node.js</span>
                <span className="px-3 py-1 rounded-full bg-secondary text-foreground text-sm">TypeScript</span>
                <span className="px-3 py-1 rounded-full bg-secondary text-foreground text-sm">MongoDB</span>
              </div>
              
              <h4 className="font-medium mb-2">Education</h4>
              <div className="mb-6">
                <div className="text-sm">BSc Computer Science</div>
                <div className="text-sm text-muted-foreground">University of Technology, 2018 - 2022</div>
              </div>
              
              <h4 className="font-medium mb-2">Experience</h4>
              <div className="space-y-4">
                <div>
                  <div className="text-sm">Senior Developer</div>
                  <div className="text-sm text-muted-foreground">TechCorp, 2020 - Present</div>
                </div>
                <div>
                  <div className="text-sm">Web Developer</div>
                  <div className="text-sm text-muted-foreground">Digital Solutions Inc, 2018 - 2020</div>
                </div>
              </div>
            </div>
            
            <div>
              <AnalyticsChart 
                title="Score Breakdown" 
                data={scoreData} 
                type="bar" 
                className="mb-6" 
              />
              
              <div className="glass-card p-6">
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.name.toLowerCase().replace(' ', '.')}@example.com</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Button variant="link" size="sm" className="p-0 h-auto text-sm">
                      <Download className="mr-1 h-3 w-3" />
                      Download Resume
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="resume">
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Resume Preview</h3>
            <div className="bg-white rounded-lg p-6 border border-border h-[600px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h4 className="font-medium mb-2">Resume Preview</h4>
                <p className="text-muted-foreground mb-4">
                  Preview would be displayed here in a real implementation.
                </p>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="evaluation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalyticsChart 
              title="Criteria Evaluation" 
              data={[
                { name: 'Education', value: candidate.educationScore, color: '#3b82f6' },
                { name: 'Soft Skills', value: candidate.softSkillsScore, color: '#8b5cf6' },
                { name: 'Technical', value: candidate.technicalScore, color: '#10b981' },
                { name: 'Experience', value: candidate.experience * 10, color: '#f59e0b' },
                { name: 'Cultural Fit', value: 85, color: '#ec4899' }
              ]} 
              type="bar" 
            />
            
            <AnalyticsChart 
              title="Radar Assessment" 
              data={[
                { subject: 'Technical', A: candidate.technicalScore, fullMark: 100 },
                { subject: 'Communication', A: 85, fullMark: 100 },
                { subject: 'Problem Solving', A: 90, fullMark: 100 },
                { subject: 'Leadership', A: 75, fullMark: 100 },
                { subject: 'Teamwork', A: 88, fullMark: 100 }
              ]} 
              type="bar" 
            />
          </div>
        </TabsContent>
        
        <TabsContent value="timeline">
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-6">Recruitment Timeline</h3>
            
            <div className="relative pl-8 border-l border-border">
              {timelineEvents.map((event, index) => (
                <div key={index} className="mb-8 relative">
                  <div className="absolute -left-[25px] h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className="glass-card p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <h4 className="font-medium mb-1">{event.stage}</h4>
                    <p className="text-sm">{event.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notes">
          <div className="glass-card p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">HR Notes</h3>
            <div className="space-y-6">
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Initial Screening Note</div>
                  <div className="text-xs text-muted-foreground">May 16, 2023</div>
                </div>
                <p className="text-sm">
                  Candidate has strong technical background and relevant experience.
                  Education credentials verified. Moving forward to soft skills evaluation.
                </p>
              </div>
              
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Technical Assessment Feedback</div>
                  <div className="text-xs text-muted-foreground">May 20, 2023</div>
                </div>
                <p className="text-sm">
                  Excellent problem-solving skills demonstrated in technical assessment.
                  Strong knowledge of JavaScript frameworks and database design.
                  Recommended for final consideration.
                </p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Add Note</h3>
            <textarea
              className="w-full h-32 bg-background border border-input rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your notes about the candidate..."
            ></textarea>
            <div className="flex justify-end mt-4">
              <Button>Save Note</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default CandidateProfile;
