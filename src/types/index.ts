import type { MatchJobsOutput } from '@/ai/flows/match-jobs';
import type { JobOpening as MockJobOpening } from '@/lib/mockData';

// Type for job data coming from AI recommendations
export type RecommendedJob = MatchJobsOutput[0] & { id: string; applicationUrl?: string };

// Type for job data from mock data, ensuring it has an id
export type JobWithId = MockJobOpening & { id: string; applicationUrl?: string };

// A unified type for jobs that can be displayed by JobCard
export type DisplayableJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;   // From mock data or full job details
  matchReason?: string; // From AI recommendation
  companyLogo?: string;
  applicationUrl?: string;
};
