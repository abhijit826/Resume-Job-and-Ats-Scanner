'use server';
/**
 * @fileOverview Defines a Genkit flow for scanning a resume against a job description,
 * simulating an Applicant Tracking System (ATS) analysis.
 *
 * - atsScan - A function that takes a resume and job description, returning an ATS-like analysis.
 * - AtsScanInput - The input type for the atsScan function.
 * - AtsScanOutput - The output type for the atsScan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AtsScanInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  jobDescription: z.string().describe('The full text of the job description to analyze against.'),
});
export type AtsScanInput = z.infer<typeof AtsScanInputSchema>;

const AtsScanOutputSchema = z.object({
  overallFit: z
    .string()
    .describe(
      "A qualitative assessment of the resume's fit for the job (e.g., Strong Fit, Good Fit, Needs Improvement)."
    ),
  overallScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'A numerical score from 0 to 100 representing the overall match quality of the resume for the job description.'
    ),
  strengthsAnalysis: z
    .string()
    .describe(
      'A summary of how the resume strongly aligns with the job description, highlighting key matching skills and experiences.'
    ),
  improvementSuggestions: z
    .string()
    .describe(
      'Actionable advice on how to tailor the resume to better match the job description, including specific keywords or experiences to emphasize or add.'
    ),
  missingKeywords: z
    .array(z.string())
    .describe(
      'A list of important keywords from the job description that seem to be missing or underrepresented in the resume.'
    ),
  matchingKeywords: z
    .array(z.string())
    .describe(
      'A list of important keywords found in both the resume and the job description.'
    ),
  keywordStats: z.object({
    totalKeywordsInJobDescription: z.number().describe('The total number of unique, important keywords identified in the job description.'),
    matchedKeywordsCount: z.number().describe('The number of important keywords from the job description found in the resume.'),
    missingKeywordsCount: z.number().describe('The number of important keywords from the job description not found in the resume.'),
    matchPercentage: z.number().min(0).max(100).describe('The percentage of important job description keywords found in the resume (0-100).'),
  }).describe('Statistics related to keyword matching.'),
});
export type AtsScanOutput = z.infer<typeof AtsScanOutputSchema>;

export async function atsScan(input: AtsScanInput): Promise<AtsScanOutput> {
  return atsScanFlow(input);
}

const atsScanPrompt = ai.definePrompt({
  name: 'atsScanPrompt',
  input: {schema: AtsScanInputSchema},
  output: {schema: AtsScanOutputSchema},
  prompt: `You are an expert ATS (Applicant Tracking System) resume scanner.
Your task is to analyze the provided resume against the given job description and provide a detailed analysis.

Resume:
{{media url=resumeDataUri}}

Job Description:
{{{jobDescription}}}

Please provide your analysis strictly in the JSON format defined by the output schema.
The analysis should include:
- overallFit: A qualitative assessment (e.g., Strong Fit, Good Fit, Needs Improvement).
- overallScore: A numerical score from 0 to 100 representing the overall match quality.
- strengthsAnalysis: A summary of strong alignments.
- improvementSuggestions: Actionable advice for tailoring the resume.
- missingKeywords: Important keywords from the job description missing in the resume.
- matchingKeywords: Important keywords present in both.
- keywordStats: An object containing:
    - totalKeywordsInJobDescription: Total unique, important keywords in the job description.
    - matchedKeywordsCount: Count of important job description keywords found in the resume.
    - missingKeywordsCount: Count of important job description keywords NOT found in the resume.
    - matchPercentage: Percentage (0-100) of important job description keywords found in the resume. Calculate this as (matchedKeywordsCount / totalKeywordsInJobDescription) * 100, rounded to the nearest integer. If totalKeywordsInJobDescription is 0, matchPercentage should be 0.

Focus on extracting relevant information and providing constructive feedback. Be concise and direct in your analysis. Ensure all numerical fields are populated correctly according to their descriptions.
`,
});

const atsScanFlow = ai.defineFlow(
  {
    name: 'atsScanFlow',
    inputSchema: AtsScanInputSchema,
    outputSchema: AtsScanOutputSchema,
  },
  async input => {
    const {output} = await atsScanPrompt(input);
    if (!output) {
      throw new Error('The ATS scan prompt did not return an output.');
    }
    return output;
  }
);