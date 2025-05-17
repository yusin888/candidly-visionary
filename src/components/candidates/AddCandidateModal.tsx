import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Upload, File, Loader } from "lucide-react";
import axios from "axios";

interface Job {
  _id: string;
  title: string;
  department: string;
}

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCandidateAdded?: () => void;
}

const API_BASE_URL = "https://scoring-and-ranking.vercel.app";

const AddCandidateModal = ({ isOpen, onClose, onCandidateAdded }: AddCandidateModalProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isJobsLoading, setIsJobsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchJobs();
      resetForm();
    }
  }, [isOpen]);

  const fetchJobs = async () => {
    try {
      setIsJobsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/jobs`);
      setJobs(response.data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again.",
        variant: "destructive",
      });
      console.error("Error fetching jobs:", err);
    } finally {
      setIsJobsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedJobId("");
    setResumeFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedJobId) {
      toast({
        title: "Error",
        description: "Please select a job",
        variant: "destructive",
      });
      return;
    }

    if (!resumeFile) {
      toast({
        title: "Error",
        description: "Please upload a resume",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jobId", selectedJobId);
    // Optional parameters with default values
    formData.append("fuzzyFactor", "0.2");
    formData.append("membershipType", "triangular");

    try {
      await axios.post(`${API_BASE_URL}/api/candidates/upload-parse-score`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Success",
        description: "Candidate added successfully!",
      });

      // Close modal and refresh candidates list
      if (onCandidateAdded) {
        onCandidateAdded();
      }
      onClose();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to upload and score candidate",
        variant: "destructive",
      });
      console.error("Error uploading candidate:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Candidate</DialogTitle>
          <DialogDescription>
            Upload a candidate's resume and select the relevant job to automatically score and add them to your pool.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="job">Select Job</Label>
            {isJobsLoading ? (
              <div className="flex items-center space-x-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading jobs...</span>
              </div>
            ) : (
              <Select 
                value={selectedJobId} 
                onValueChange={setSelectedJobId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job._id} value={job._id}>
                      {job.title} - {job.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="resume">Upload Resume</Label>
            <div className="relative">
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="grid gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("resume")?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {resumeFile ? "Change File" : "Upload Resume"}
                </Button>
                {resumeFile && (
                  <div className="flex items-center p-2 rounded-md bg-secondary">
                    <File className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm truncate">{resumeFile.name}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !selectedJobId || !resumeFile}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload & Score
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCandidateModal;
