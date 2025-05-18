import { config } from 'dotenv';
config();

import '@/ai/flows/match-jobs.ts';
import '@/ai/flows/summarize-job-description.ts';
import '@/ai/flows/analyze-resume.ts';