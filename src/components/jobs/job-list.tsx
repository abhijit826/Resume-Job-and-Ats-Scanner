import JobCard from './job-card';
import type { RecommendedJob, DisplayableJob } from '@/types';

interface JobListProps {
  jobs: RecommendedJob[]; // Specifically for recommended jobs which include matchReason
  savedJobIds: string[];
  onSaveToggle: (jobId: string) => void;
}

export default function JobList({ jobs, savedJobIds, onSaveToggle }: JobListProps) {
  if (jobs.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No job recommendations found. Try uploading your resume or refining your search.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => {
        // Adapt RecommendedJob to DisplayableJob for JobCard
        const displayableJob: DisplayableJob = {
          ...job, // Includes id, title, company, location, matchReason
          // Potentially map companyLogo if available, or add a default
        };
        return (
          <JobCard
            key={job.id}
            job={displayableJob}
            isSaved={savedJobIds.includes(job.id)}
            onSaveToggle={onSaveToggle}
          />
        );
      })}
    </div>
  );
}
