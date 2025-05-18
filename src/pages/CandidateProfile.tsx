import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { statusLabels, timelineEvents } from '@/lib/data';
import { cn } from '@/lib/utils';

// UPDATED ApiCandidate Interface
interface ApiCandidate {
  _id: string; // Mapped from 'id'
  id?: string; // Original id from API

  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phone: string;

  role?: string;
  experience?: number; // Root level experience, e.g., 0.4 years
  status: string;
  
  initialScore?: number; // Root level
  confidenceScore?: number;

  // scores object from /:id response
  scores?: {
    education?: number; // percentage e.g. 80 for 80%
    technical?: number; // percentage
    final?: number;     // percentage
    // soft_skills is notably missing here, will need to be handled
  };

  appliedOn?: string; // Date string "YYYY-MM-DDTHH:mm:ss.sssZ"
  resume?: string; // Path like "/uploads/resume.pdf"

  attributes?: {
    [key: string]: boolean | number | string | undefined; // Flexible for various skills and data points
    yearsOfExperience?: number; // This might be redundant if root `experience` is used
    education_level?: string;
    developer_experience?: number;
    engineer_experience?: number;
    intern_experience?: number;
    designer_experience?: number;
    fullstack_experience?: number;
    field_of_study?: string;
    has_bachelors?: boolean;
    has_cs_degree?: boolean;
    // Add other specific attributes from API if known
  };

  stages?: { // Stages might have less detail now
    phoneScreen?: { completed: boolean; score?: number; notes?: string };
    codingInterview?: { completed: boolean; score?: number; notes?: string };
    onsiteInterview?: { completed: boolean; score?: number; notes?: string };
  };

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
    "Total Estimated Years of Experience"?: string; // e.g., "0.4"
    rawResumeText?: string;
  };
  
  keySkills?: string[]; // From /:id example e.g. ["javascript"]
  finalRanking?: boolean;

  // Fields from old interface not directly in new /:id spec or changed:
  // jobId, passedThreshold, isShortlisted, education (numeric score)
  // resumeUrl (now `resume` string path)
  // createdAt, updatedAt (now `appliedOn`)
}

const CandidateProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<ApiCandidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCandidate = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching candidate from /api/candidates/:id with ID:', id);
        const response = await fetch(`https://scoring-and-ranking.vercel.app/api/candidates/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch candidate with ID: ${id}. Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Raw API response from /api/candidates/:id :', JSON.stringify(data, null, 2));
        
        setCandidate({ 
          ...data, 
          _id: data.id || data._id // Ensure _id is populated
        });
      } catch (err) {
        console.error('Error fetching candidate:', err);
        setError(err instanceof Error ? err.message : 'Failed to load candidate data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCandidate();
    }
  }, [id]);
  
  const getRole = (c: ApiCandidate): string => {
    if (!c) return "Software Engineer";
    if (c.role) return c.role; // Use direct role if provided

    // Fallback to attribute-based role detection (needs adjustment for new attributes structure)
    if (c.attributes) {
      const attrs = c.attributes;
      if ((attrs.react_js === true || attrs.react === true) && (attrs.javascript === true || attrs.js === true)) return "Frontend Developer";
      if ((attrs.node_js === true || attrs.nodejs === true) && (attrs.mongodb === true || attrs.mongo === true)) return "Backend Developer";
      if (attrs["machine learning"] === true || attrs.tensorflow === true || attrs.ml === true) return "Machine Learning Engineer";
      if (attrs.testing === true || attrs["quality assurance"] === true) return "QA Engineer";
      if (attrs["system design"] === true || attrs.architecture === true) return "Systems Architect";
      if (attrs.docker === true || attrs.kubernetes === true) return "DevOps Engineer";
      if (attrs["ui design"] === true || attrs["ux design"] === true) return "UX/UI Designer";
      if (attrs["product management"] === true || attrs.agile === true) return "Product Manager";
      if (attrs["data science"] === true) return "Data Scientist";
    }
    return "Software Engineer"; // Default
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-medium mb-2">Loading Candidate Profile...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the candidate data.</p>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !candidate) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-medium mb-2">{error ? 'Error Loading Candidate' : 'Candidate Not Found'}</h2>
          <p className="text-muted-foreground mb-6">{error || "The candidate you're looking for doesn't exist or could not be loaded."}</p>
          <Button asChild>
            <Link to="/candidates"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Candidates</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  let uiStatus: 'initial' | 'soft_skills' | 'detailed_scoring' | 'final_ranking' | 'hired' | 'rejected' = 'initial';
  
  // Mapping API status (e.g., "applied", "interviewing") to UI status category
  // This might need adjustment based on the actual values in `candidate.status`
  switch(candidate.status?.toLowerCase()) {
    case 'applied':
    case 'screening':
      uiStatus = 'initial';
      break;
    case 'interviewing': // Assuming this status implies detailed scoring phase
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
  
  const educationLevel = candidate.attributes?.education_level ? 
    candidate.attributes.education_level.toString().charAt(0).toUpperCase() + candidate.attributes.education_level.toString().slice(1) : 
    (candidate.parsedResume?.["Education Details"]?.[0]?.["education level"] || 'Not Specified');
  
  // Scores - adapt to new structure
  // Initial Score (already a percentage from 0-1 in API, convert to 0-100 for display)
  const initialScorePercent = candidate.initialScore ? Math.round(candidate.initialScore * 100) : 0;

  // Soft Skills Score - Retrieved from stages.phoneScreen.score as it's not in candidate.scores
  const softSkillsScorePercent = candidate.stages?.phoneScreen?.score ? 
                                (candidate.stages.phoneScreen.score * 100).toFixed(2) : 
                                "N/A";

  // Technical Score from `candidate.scores.technical` (assuming it's a percentage 0-100)
  // If it's 0-1 (like initialScore was), it needs *100. API spec says 0 for now. Let's assume it will be 0-100.
  const technicalScorePercent = candidate.scores?.technical ? candidate.scores.technical.toFixed(2) :
                                (candidate.stages?.codingInterview?.score ? (candidate.stages.codingInterview.score * 100).toFixed(2) : "0.00");

  const initialScoreNum = parseFloat(initialScorePercent.toFixed(2));
  const softSkillsScoreNum = softSkillsScorePercent === "N/A" ? 0 : parseFloat(softSkillsScorePercent); // Chart needs a number
  const technicalScoreNum = parseFloat(technicalScorePercent);
  
  const scoreData = [
    { name: 'Initial', value: initialScoreNum, color: '#3b82f6' },
    { name: 'Soft Skills', value: softSkillsScoreNum, color: '#8b5cf6' }, // Will show 0 or N/A if not available
    { name: 'Technical', value: technicalScoreNum, color: '#10b981' }
  ];
  
  const candidateName = `${candidate.firstName} ${candidate.lastName}`;
  const determinedRole = getRole(candidate); // Use the updated getRole
  const appliedDate = candidate.appliedOn ? new Date(candidate.appliedOn).toLocaleDateString() : "Not Specified";
  const experienceYears = candidate.attributes?.yearsOfExperience ?? candidate.experience ?? 0;

  // Resume download URL
  const resumeDownloadLink = candidate.resume ? 
    (candidate.resume.startsWith('http') ? candidate.resume : `https://scoring-and-ranking.vercel.app${candidate.resume}`) 
    : '#';
  
  return (
    <MainLayout>
      <div className="flex items-center mb-6">
        <Button variant="ghost" asChild>
          <Link to="/candidates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>
      
      <div className="glass-card p-6 mb-8 animate-fade-in">
        {/* Header section with Avatar, Name, Role, Status */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl font-semibold">
              {candidateName.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold">{candidateName}</h1>
              <div className="flex items-center text-muted-foreground">
                <span>{determinedRole}</span>
                <ChevronRight className="mx-1 h-4 w-4" />
                <span className="font-medium text-foreground">{statusLabels[uiStatus]}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Action Buttons: Email, Call, etc. */}
            <Button variant="outline" size="sm"><Mail className="mr-2 h-4 w-4" />Email</Button>
            <Button variant="outline" size="sm"><Phone className="mr-2 h-4 w-4" />Call</Button>
            <Button variant="outline" size="sm"><MessageSquare className="mr-2 h-4 w-4" />Message</Button>
            <Button variant="outline" size="sm"><Share2 className="mr-2 h-4 w-4" />Share</Button>
          </div>
        </div>
        
        {/* Quick Info Boxes: Experience, Education, Technical Score, Initial Score */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Experience</div>
            <div className="text-xl font-semibold">{experienceYears} {experienceYears === 1 ? 'year' : 'years'}</div>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Education</div>
            <div className="text-xl font-semibold">{educationLevel}</div>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Technical Score</div>
            <div className="text-xl font-semibold">{technicalScorePercent === "N/A" ? "N/A" : `${technicalScorePercent}%`}</div>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Initial Score</div>
            <div className="text-xl font-semibold">{initialScorePercent}%</div>
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
                {candidateName} is a {determinedRole} with {experienceYears} {experienceYears === 1 ? 'year' : 'years'} of experience.
                Currently in the {statusLabels[uiStatus].toLowerCase()} stage of the recruitment process.
                Applied on {appliedDate}.
                Initial assessment score: {initialScorePercent}%.
              </p>
              
              <h4 className="font-medium mb-2">Key Skills</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {candidate.keySkills && candidate.keySkills.length > 0 ? (
                  candidate.keySkills.map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-full bg-secondary text-foreground text-sm">
                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                  </span>
                  ))
                ) : (
                  Object.entries(candidate.attributes || {})
                    .filter(([key, value]) => value === true && !['has_bachelors', 'has_cs_degree'].includes(key))
                    .map(([skill]) => (
                      <span key={skill} className="px-3 py-1 rounded-full bg-secondary text-foreground text-sm">
                        {skill.replace(/_/g, ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                      </span>
                    ))
                )}
                 {(!candidate.keySkills || candidate.keySkills.length === 0) && 
                  Object.values(candidate.attributes || {}).filter(v => v === true).length === 0 &&
                   <span className="text-sm text-muted-foreground">No key skills listed.</span>}
              </div>
              
              <h4 className="font-medium mb-2">Experience</h4>
              <div className="space-y-4">
                {candidate.parsedResume?.["Experience Details"]?.length ?? 0 > 0 ? (
                  candidate.parsedResume!["Experience Details"]!.map((exp, index) => (
                    <div key={index}>
                      <div className="text-sm font-medium">{exp.Roles || "N/A"}</div>
                      <div className="text-sm text-muted-foreground">{exp["Industry Name"] || "N/A"}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No detailed experience information available in parsed resume.</div>
                )}
              </div>

              <h4 className="font-medium mb-2 mt-6">Education</h4>
              <div className="space-y-4">
                {candidate.parsedResume?.["Education Details"]?.length ?? 0 > 0 ? (
                  candidate.parsedResume!["Education Details"]!.map((edu, index) => (
                    <div key={index}>
                      <div className="text-sm">{edu["education level"] || "N/A"} in {edu["field of study"] || "N/A"}</div>
                      <div className="text-sm text-muted-foreground">
                        {edu.institution || "N/A"}
                        {edu["date completed"] ? `, ${edu["date completed"]}` : ""}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mb-6">
                    <div className="text-sm">{candidate.attributes?.education_level || "N/A"} in {candidate.attributes?.field_of_study || "Not Specified"}</div>
                    <div className="text-sm text-muted-foreground">University details not specified.</div>
                </div>
                )}
              </div>
            </div>
            
            {/* Contact Info and Score Breakdown Chart */}
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
                    <span className="text-sm">{candidate.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{candidate.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    {candidate.resume ? (
                      <Button variant="link" size="sm" className="p-0 h-auto text-sm" asChild>
                        <a href={resumeDownloadLink} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-1 h-3 w-3" />
                      Download Resume
                        </a>
                    </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">No resume uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="resume">
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Resume</h3>
            {candidate.resume ? (
              <iframe 
                src={resumeDownloadLink} 
                className="w-full h-[600px] border rounded-md"
                title={`${candidateName}'s Resume`}
              >
                Your browser does not support PDFs. Please <a href={resumeDownloadLink} target="_blank" rel="noopener noreferrer">download the PDF</a> to view it.
              </iframe>
            ) : (
              <p className="text-muted-foreground">No resume uploaded or available for preview.</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="evaluation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalyticsChart 
              title="Criteria Evaluation" 
              data={[
                { name: 'Initial', value: initialScoreNum, color: '#3b82f6' },
                { name: 'Soft Skills', value: softSkillsScoreNum, color: '#8b5cf6' },
                { name: 'Technical', value: technicalScoreNum, color: '#10b981' },
                { name: 'Experience', value: (candidate.experience || 0) * 10, color: '#f59e0b' }, // Simple scaling for chart
                { name: 'Cultural Fit', value: candidate.scores?.final || 70, color: '#ec4899' } // Placeholder for cultural fit or use final
              ]} 
              type="bar" 
            />
            <AnalyticsChart 
              title="Radar Assessment (Sample)" 
              data={[ // These are illustrative values, update with actual data if available
                { subject: 'Technical', A: technicalScoreNum, fullMark: 100 },
                { subject: 'Communication', A: softSkillsScoreNum, fullMark: 100 }, // Or another relevant metric
                { subject: 'Problem Solving', A: 80, fullMark: 100 }, // Placeholder
                { subject: 'Leadership', A: 70, fullMark: 100 }, // Placeholder
                { subject: 'Teamwork', A: 85, fullMark: 100 } // Placeholder
              ]} 
              type="bar" // Radar chart might need specific component or library
            />
          </div>
        </TabsContent>
        
        <TabsContent value="timeline">
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Recruitment Timeline</h3>
            <div className="space-y-8">
              {/* Application Received */}
              <div className="relative pl-8 border-l border-border">
                <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                <div className="mb-1 text-sm text-muted-foreground">
                  {appliedDate}
                </div>
                <div className="font-medium">Application Received</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Candidate applied for {determinedRole} position.
                </p>
              </div>
              
              {/* Initial Screening - using initialScore */}
              <div className="relative pl-8 border-l border-border">
                <div className={cn(
                  "absolute left-[-8px] top-0 w-4 h-4 rounded-full",
                  candidate.initialScore !== undefined ? "bg-primary" : "bg-muted"
                )}></div>
                <div className="mb-1 text-sm text-muted-foreground">
                  {appliedDate} {/* Or a more specific screening date if available */}
                </div>
                <div className="font-medium">Initial Screening</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {candidate.initialScore !== undefined
                    ? `Resume and qualifications reviewed, initial score: ${initialScorePercent}%` 
                    : "Pending review"}
                </p>
              </div>
              
              {/* Phone Screen / Soft Skills Evaluation */}
            <div className="relative pl-8 border-l border-border">
                <div className={cn(
                  "absolute left-[-8px] top-0 w-4 h-4 rounded-full",
                    candidate.stages?.phoneScreen?.completed ? "bg-primary" : "bg-muted"
                )}></div>
                <div className="mb-1 text-sm text-muted-foreground">
                    {candidate.stages?.phoneScreen?.completed 
                      //? new Date(candidate.stages.phoneScreen.dateCompleted).toLocaleDateString() // Assuming a date field
                      ? "Completed" // Placeholder if specific date not available
                    : "Pending"}
                </div>
                <div className="font-medium">Soft Skills Evaluation</div>
                <p className="text-sm text-muted-foreground mt-1">
                    {candidate.stages?.phoneScreen?.completed 
                      ? `Soft skills assessed. Score: ${softSkillsScorePercent === "N/A" ? "N/A" : softSkillsScorePercent + "%"}`
                    : "Not started yet"}
                </p>
                  {candidate.stages?.phoneScreen?.notes && (
                  <div className="text-sm mt-2 p-2 bg-secondary/30 rounded">
                    <span className="font-medium">Notes:</span> {candidate.stages.phoneScreen.notes}
                  </div>
                )}
              </div>
              
              {/* Technical Assessment */}
              <div className="relative pl-8 border-l border-border">
                <div className={cn(
                  "absolute left-[-8px] top-0 w-4 h-4 rounded-full",
                  candidate.stages?.codingInterview?.completed ? "bg-primary" : "bg-muted"
                )}></div>
                <div className="mb-1 text-sm text-muted-foreground">
                  {candidate.stages?.codingInterview?.completed 
                    //? new Date(candidate.stages.codingInterview.dateCompleted).toLocaleDateString()
                    ? "Completed"
                    : "Pending"}
                    </div>
                <div className="font-medium">Technical Assessment</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {candidate.stages?.codingInterview?.completed 
                    ? `Technical knowledge evaluated. Score: ${technicalScorePercent === "N/A" ? "N/A" : technicalScorePercent + "%"}` 
                    : "Not started yet"}
                </p>
                {candidate.stages?.codingInterview?.notes && (
                  <div className="text-sm mt-2 p-2 bg-secondary/30 rounded">
                    <span className="font-medium">Notes:</span> {candidate.stages.codingInterview.notes}
                  </div>
                )}
              </div>
              
              {/* Final Interview */}
              <div className="relative pl-8"> {/* Removed border-l for the last item if desired */}
                <div className={cn(
                  "absolute left-[-8px] top-0 w-4 h-4 rounded-full",
                  candidate.stages?.onsiteInterview?.completed ? "bg-primary" : "bg-muted"
                )}></div>
                <div className="mb-1 text-sm text-muted-foreground">
                  {candidate.stages?.onsiteInterview?.completed 
                    //? new Date(candidate.stages.onsiteInterview.dateCompleted).toLocaleDateString()
                    ? "Completed"
                    : "Pending"}
                </div>
                <div className="font-medium">Final Interview</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {candidate.stages?.onsiteInterview?.completed 
                    ? `Final interview completed. Score: ${candidate.scores?.final ? candidate.scores.final.toFixed(2) + "%" : 'N/A'}` 
                    : "Not scheduled yet"}
                </p>
                {candidate.stages?.onsiteInterview?.notes && (
                  <div className="text-sm mt-2 p-2 bg-secondary/30 rounded">
                    <span className="font-medium">Notes:</span> {candidate.stages.onsiteInterview.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notes">
          {/* HR Notes Section - check optional chaining for stages and notes */}
          <div className="glass-card p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">HR Notes</h3>
            <div className="space-y-6">
              {candidate.stages?.phoneScreen?.notes && (
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Phone Screen Note</div>
                    {/* <div className="text-xs text-muted-foreground">{appliedDate}</div> Assuming notes are added around application time or stage completion */}
                  </div>
                  <p className="text-sm">{candidate.stages.phoneScreen.notes}</p>
                </div>
              )}
              
              {candidate.stages?.codingInterview?.notes && (
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Technical Assessment Feedback</div>
                  </div>
                  <p className="text-sm">{candidate.stages.codingInterview.notes}</p>
                </div>
              )}
              
              {candidate.stages?.onsiteInterview?.notes && (
                <div className="glass p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Onsite Interview Feedback</div>
                  </div>
                  <p className="text-sm">{candidate.stages.onsiteInterview.notes}</p>
              </div>
              )}
              
              {!candidate.stages?.phoneScreen?.notes && 
               !candidate.stages?.codingInterview?.notes && 
               !candidate.stages?.onsiteInterview?.notes && (
                <p className="text-muted-foreground">No notes available for these stages.</p>
              )}
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
