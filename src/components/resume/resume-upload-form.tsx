'use client';

import { useState, type FormEvent, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { matchJobs, type MatchJobsInput, type MatchJobsOutput } from '@/ai/flows/match-jobs';
import type { JobOpening } from '@/lib/mockData'; // Using JobOpening from mockData for type consistency
import { UploadCloud } from 'lucide-react';

interface ResumeUploadFormProps {
  onResults: (results: MatchJobsOutput) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  jobOpenings: JobOpening[]; // Pass the available job openings
}

export default function ResumeUploadForm({ onResults, setLoading, setError, jobOpenings }: ResumeUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setError(null);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        setFile(null);
        setFileName(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input
        }
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF resume to upload.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const resumeDataUri = reader.result as string;
        
        // Prepare job openings for the AI flow (AI expects title, company, location, description)
        const aiJobOpenings = jobOpenings.map(job => ({
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
        }));

        const input: MatchJobsInput = { resumeDataUri, jobOpenings: aiJobOpenings };
        const results = await matchJobs(input);
        onResults(results);
        toast({
          title: "Analysis Complete!",
          description: `Found ${results.length} potential job matches.`,
        });
      };
      reader.onerror = () => {
        console.error("Error reading file:", reader.error);
        setError("Failed to read the resume file. Please try again.");
        toast({
          title: "File Read Error",
          description: "Could not read the resume file. Please try again.",
          variant: "destructive",
        });
      };
    } catch (err) {
      console.error("Error processing resume:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to process resume: ${errorMessage}`);
      toast({
        title: "Processing Error",
        description: `An error occurred while matching jobs: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 sm:p-8 rounded-lg shadow-md border border-border">
      <div>
        <Label htmlFor="resume-upload" className="block text-sm font-medium text-foreground mb-1">
          Resume (PDF only)
        </Label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-input hover:border-primary transition-colors">
          <div className="space-y-1 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="flex text-sm text-muted-foreground">
              <label
                htmlFor="resume-upload-input"
                className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
              >
                <span>Upload a file</span>
                <Input 
                  id="resume-upload-input" 
                  name="resume-upload-input" 
                  type="file" 
                  className="sr-only" 
                  accept=".pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-muted-foreground">PDF up to 10MB</p>
            {fileName && <p className="text-sm text-foreground pt-2">Selected: {fileName}</p>}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full text-base py-3" disabled={!file}>
        Find My Matches
      </Button>
    </form>
  );
}
