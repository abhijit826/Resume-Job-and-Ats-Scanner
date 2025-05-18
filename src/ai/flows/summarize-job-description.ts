'use server';
/**
 * @fileOverview Summarizes a job description to provide a concise overview of responsibilities and requirements.
 *
 * - summarizeJobDescription - A function that summarizes the job description.
 * - SummarizeJobDescriptionInput - The input type for the summarizeJobDescription function.
 * - SummarizeJobDescriptionOutput - The return type for the summarizeJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeJobDescriptionInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The full text of the job description to be summarized.'),
});
export type SummarizeJobDescriptionInput = z.infer<
  typeof SummarizeJobDescriptionInputSchema
>;

const SummarizeJobDescriptionOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the job description, highlighting key responsibilities and requirements.'
    ),
});
export type SummarizeJobDescriptionOutput = z.infer<
  typeof SummarizeJobDescriptionOutputSchema
>;

export async function summarizeJobDescription(
  input: SummarizeJobDescriptionInput
): Promise<SummarizeJobDescriptionOutput> {
  return summarizeJobDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeJobDescriptionPrompt',
  input: {schema: SummarizeJobDescriptionInputSchema},
  output: {schema: SummarizeJobDescriptionOutputSchema},
  prompt: `Summarize the following job description, highlighting the key responsibilities and requirements:

{{{jobDescription}}}`,
});

const summarizeJobDescriptionFlow = ai.defineFlow(
  {
    name: 'summarizeJobDescriptionFlow',
    inputSchema: SummarizeJobDescriptionInputSchema,
    outputSchema: SummarizeJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
