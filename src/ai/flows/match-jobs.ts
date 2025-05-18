// match-jobs.ts
'use server';

/**
 * @fileOverview This file defines the Genkit flow for matching jobs based on a resume.
 *
 * - matchJobs - A function that takes a resume (as a data URI) and job descriptions, and returns job recommendations.
 * - MatchJobsInput - The input type for the matchJobs function.
 * - MatchJobsOutput - The output type for the matchJobs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const MatchJobsInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  jobOpenings: z.array(
    z.object({
      title: z.string().describe('The job title'),
      company: z.string().describe('The company name'),
      location: z.string().describe('The job location'),
      description: z.string().describe('The job description'),
    })
  ).describe('A list of job opening objects to consider for matching.'),
});
export type MatchJobsInput = z.infer<typeof MatchJobsInputSchema>;

// Define the output schema
const MatchJobsOutputSchema = z.array(
  z.object({
    title: z.string().describe('The job title'),
    company: z.string().describe('The company name'),
    location: z.string().describe('The job location'),
    matchReason: z.string().describe('The reason why this job is a good match.'),
  })
).describe('A list of recommended jobs with reasons for the match.');
export type MatchJobsOutput = z.infer<typeof MatchJobsOutputSchema>;

// Exported function to call the flow
export async function matchJobs(input: MatchJobsInput): Promise<MatchJobsOutput> {
  return matchJobsFlow(input);
}

// Define the prompt
const matchJobsPrompt = ai.definePrompt({
  name: 'matchJobsPrompt',
  input: {schema: MatchJobsInputSchema},
  output: {schema: MatchJobsOutputSchema},
  prompt: `You are an AI job matching expert. Analyze the provided resume and
  match it against the list of job openings. For each job opening, determine
  if it's a good fit for the candidate based on their skills and experience.

  Resume:
  {{media url=resumeDataUri}}

  Job Openings:
  {{#each jobOpenings}}
  Title: {{title}}
  Company: {{company}}
  Location: {{location}}
  Description: {{description}}
  ---
  {{/each}}

  Provide a list of recommended jobs, including the title, company, location, and a brief explanation of why each job is a good match for the candidate. Only include jobs that are a strong match.

  Format your response as a JSON array of objects with the following keys:
  - title (string): The job title.
  - company (string): The company name.
  - location (string): The job location.
  - matchReason (string): A brief explanation of why the job is a good match.
  `,
});

// Define the flow
const matchJobsFlow = ai.defineFlow(
  {
    name: 'matchJobsFlow',
    inputSchema: MatchJobsInputSchema,
    outputSchema: MatchJobsOutputSchema,
  },
  async input => {
    const {output} = await matchJobsPrompt(input);
    return output!;
  }
);
