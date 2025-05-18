import JobCard from './job-card';
import type { JobWithId, DisplayableJob } from '@/types';

interface SavedJobsListProps {
  jobs: JobWithId[]; // These are full job objects from mockData that are saved
  onUnsave: (jobId: string) => void;
}

export default function SavedJobsList({ jobs, onUnsave }: SavedJobsListProps) {
  if (jobs.length === 0) {
    return <p className="text-muted-foreground text-center py-8">You haven't saved any jobs yet. Explore recommendations and save your favorites!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => {
         // Adapt JobWithId to DisplayableJob for JobCard
        const displayableJob: DisplayableJob = {
          ...job, // Includes id, title, company, location, description, companyLogo
        };
        return (
          <JobCard
            key={job.id}
            job={displayableJob}
            isSaved={true} // All jobs here are saved
            onSaveToggle={() => onUnsave(job.id)} // Action is to unsave
          />
        );
        })}
    </div>
  );
}
