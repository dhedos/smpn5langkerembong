'use server';
/**
 * @fileOverview This file implements an AI-powered content optimizer flow.
 *
 * - adminContentOptimizer - A function that generates concise summaries and relevant SEO tags for content.
 * - AdminContentOptimizerInput - The input type for the adminContentOptimizer function.
 * - AdminContentOptimizerOutput - The return type for the adminContentOptimizer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminContentOptimizerInputSchema = z.object({
  content: z
    .string()
    .describe('The news article or announcement text to be optimized.'),
});
export type AdminContentOptimizerInput = z.infer<
  typeof AdminContentOptimizerInputSchema
>;

const AdminContentOptimizerOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the provided content.'),
  seoTags: z
    .array(z.string())
    .describe('A list of relevant SEO keywords and phrases for the content.'),
});
export type AdminContentOptimizerOutput = z.infer<
  typeof AdminContentOptimizerOutputSchema
>;

export async function adminContentOptimizer(
  input: AdminContentOptimizerInput
): Promise<AdminContentOptimizerOutput> {
  return adminContentOptimizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminContentOptimizerPrompt',
  input: {schema: AdminContentOptimizerInputSchema},
  output: {schema: AdminContentOptimizerOutputSchema},
  prompt: `You are an AI assistant specialized in content optimization for school websites.
Your task is to analyze the provided news article or announcement text and generate two key pieces of information:

1.  **A concise summary**: This summary should capture the main points of the content in a brief, engaging paragraph, suitable for quick reading on a school website.
2.  **Relevant SEO tags**: These should be a list of keywords and short phrases (up to 3 words) that are highly relevant to the content, improving its discoverability through search engines. Return these as an array of strings.

Content to optimize:
{{{content}}}`,
});

const adminContentOptimizerFlow = ai.defineFlow(
  {
    name: 'adminContentOptimizerFlow',
    inputSchema: AdminContentOptimizerInputSchema,
    outputSchema: AdminContentOptimizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate summary and SEO tags.');
    }
    return output;
  }
);
