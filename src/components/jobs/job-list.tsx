
import JobCard from './job-card';
import type { RecommendedJob, DisplayableJob } from '@/types';

interface JobListProps {
  jobs: RecommendedJob[]; 
  savedJobIds: string[];
  onSaveToggle: (jobId: string) => void;
}

export default function JobList({ jobs, savedJobIds, onSaveToggle }: JobListProps) {
  if (jobs.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No job recommendations found. Try uploading your resume or refining your search.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job, index) => {
        const displayableJob: DisplayableJob = {
          ...job, 
          applicationUrl: job.applicationUrl, // Ensure applicationUrl is passed
        };
        return (
          <div
            key={job.id}
            className="opacity-0 animate-fadeInUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <JobCard
              job={displayableJob}
              isSaved={savedJobIds.includes(job.id)}
              onSaveToggle={onSaveToggle}
            />
          </div>
        );
      })}
    </div>
  );
}
