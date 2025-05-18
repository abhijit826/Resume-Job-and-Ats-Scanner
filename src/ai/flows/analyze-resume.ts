// src/ai/flows/analyze-resume.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing a resume and extracting key information.
 *
 * analyzeResume - A function that takes a resume data URI and returns the extracted information.
 * AnalyzeResumeInput - The input type for the analyzeResume function.
 * AnalyzeResumeOutput - The output type for the analyzeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      'A resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected the expected format
    ),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  skills: z.array(z.string()).describe('A list of skills extracted from the resume.'),
  experience: z
    .array(
      z.object({
        title: z.string().describe('The job title.'),
        company: z.string().describe('The company name.'),
        dates: z.string().describe('The start and end dates of the job.'),
        description: z.string().describe('A description of the job responsibilities.'),
      })
    )
    .describe('A list of work experiences extracted from the resume.'),
  education: z
    .array(
      z.object({
        institution: z.string().describe('The name of the educational institution.'),
        degree: z.string().describe('The degree obtained.'),
        dates: z.string().describe('The start and end dates of the education.'),
      })
    )
    .describe('A list of educational experiences extracted from the resume.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const analyzeResumePrompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are a resume parsing expert. Extract the following information from the resume. 

Output the data as a JSON object that conforms to the schema.

Resume: {{media url=resumeDataUri}}`,
});

const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumePrompt(input);
    return output!;
  }
);
