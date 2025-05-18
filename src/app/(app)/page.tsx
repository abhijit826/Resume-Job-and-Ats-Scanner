'use client';

import { useState, useEffect, useMemo } from 'react';
import ResumeUploadForm from '@/components/resume/resume-upload-form';
import JobList from '@/components/jobs/job-list';
import SavedJobsList from '@/components/jobs/saved-jobs-list';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { MatchJobsOutput } from '@/ai/flows/match-jobs';
import { mockJobOpenings } from '@/lib/mockData';
import type { JobOpening } from '@/lib/mockData';
import { useSavedJobs } from '@/hooks/use-saved-jobs';
import type { RecommendedJob, JobWithId } from '@/types';
import { UploadCloud, ListChecks, Bookmark, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CareerCompassPage() {
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const { savedJobIds, addSavedJob, removeSavedJob, isJobSaved, isInitialized } = useSavedJobs();

  // Prepare all available jobs with client-side IDs once.
  const allJobsWithIds = useMemo(() => {
    return mockJobOpenings.map(job => ({
      ...job,
      // Ensure ID is consistently generated if not present or make it stable
      id: job.id || `${job.company}-${job.title}`.replace(/\s+/g, '-').toLowerCase()
    }));
  }, []);


  const savedJobsData = useMemo(() => {
    if (!isInitialized) return [];
    return allJobsWithIds.filter(job => savedJobIds.includes(job.id));
  }, [savedJobIds, allJobsWithIds, isInitialized]);

  const handleRecommendations = (jobs: MatchJobsOutput) => {
    const jobsWithClientIds = jobs.map((job, index) => ({
      ...job,
      // Generate a unique ID for each recommendation for consistent keying and saving
      // This assumes AI output (title, company) + index can be somewhat unique for this session
      id: `${job.company}-${job.title}-${index}`.replace(/\s+/g, '-').toLowerCase()
    }));
    setRecommendedJobs(jobsWithClientIds);
    setError(null); // Clear previous errors
  };

  const handleSaveToggle = (jobId: string, jobTitle: string) => {
    if (isJobSaved(jobId)) {
      removeSavedJob(jobId);
      toast({ title: "Job Unsaved", description: `"${jobTitle}" removed from your saved jobs.` });
    } else {
      addSavedJob(jobId);
      toast({ title: "Job Saved!", description: `"${jobTitle}" added to your saved jobs.` });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Resume Upload Section */}
      <section aria-labelledby="resume-upload-title">
        <div className="flex items-center space-x-3 mb-6">
          <UploadCloud className="w-10 h-10 text-primary" />
          <h2 id="resume-upload-title" className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Find Your Next Opportunity
          </h2>
        </div>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
          Upload your resume (PDF format) and let our AI find the best job matches for you from our curated list of openings.
        </p>
        <ResumeUploadForm
          onResults={handleRecommendations}
          setLoading={setIsLoading}
          setError={setError}
          jobOpenings={allJobsWithIds as JobOpening[]} // Pass all mock jobs to the form for the AI
        />
      </section>

      {isLoading && (
        <div className="flex flex-col justify-center items-center py-10 text-center">
          <LoadingSpinner size={48} />
          <p className="mt-4 text-lg text-muted-foreground">Analyzing your resume and finding matches...</p>
          <p className="text-sm text-muted-foreground">This might take a moment.</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Error Processing Resume</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Job Recommendations Section */}
      {!isLoading && recommendedJobs.length > 0 && (
        <>
          <Separator />
          <section aria-labelledby="recommendations-title">
            <div className="flex items-center space-x-3 mb-8">
              <ListChecks className="w-10 h-10 text-primary" />
              <h2 id="recommendations-title" className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                AI-Powered Recommendations
              </h2>
            </div>
            <JobList
              jobs={recommendedJobs}
              savedJobIds={savedJobIds}
              onSaveToggle={(jobId) => {
                const job = recommendedJobs.find(j => j.id === jobId);
                if (job) handleSaveToggle(jobId, job.title);
              }}
            />
          </section>
        </>
      )}
      
      {!isLoading && recommendedJobs.length === 0 && !error && (
         <div className="text-center py-8 text-muted-foreground">
            <p>Upload your resume to see personalized job recommendations.</p>
         </div>
      )}


      {/* Saved Jobs Section */}
      {isInitialized && (
        <>
          <Separator />
          <section aria-labelledby="saved-jobs-title">
            <div className="flex items-center space-x-3 mb-8">
              <Bookmark className="w-10 h-10 text-primary" />
              <h2 id="saved-jobs-title" className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Your Saved Jobs
              </h2>
            </div>
            <SavedJobsList
              jobs={savedJobsData}
              onUnsave={(jobId) => {
                const job = savedJobsData.find(j => j.id === jobId);
                if (job) handleSaveToggle(jobId, job.title);
              }}
            />
          </section>
        </>
      )}
    </div>
  );
}
