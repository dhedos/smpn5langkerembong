'use server';
/**
 * @fileOverview A Genkit flow that provides an AI chatbot for website visitors.
 *
 * - visitorChatAssistant - A function that handles interactions with the AI chatbot.
 * - VisitorChatAssistantInput - The input type for the visitorChatAssistant function.
 * - VisitorChatAssistantOutput - The return type for the visitorChatAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VisitorChatAssistantInputSchema = z.object({
  question: z.string().describe("The user's question to the school chatbot."),
});
export type VisitorChatAssistantInput = z.infer<typeof VisitorChatAssistantInputSchema>;

const VisitorChatAssistantOutputSchema = z.object({
  answer: z.string().describe("The AI chatbot's answer to the user's question."),
});
export type VisitorChatAssistantOutput = z.infer<typeof VisitorChatAssistantOutputSchema>;

export async function visitorChatAssistant(input: VisitorChatAssistantInput): Promise<VisitorChatAssistantOutput> {
  return visitorChatAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'visitorChatAssistantPrompt',
  input: { schema: VisitorChatAssistantInputSchema },
  output: { schema: VisitorChatAssistantOutputSchema },
  prompt: `You are a helpful and professional AI chatbot for SMP Modern, a modern junior high school.
Your purpose is to assist website visitors by providing immediate and accurate answers to common questions about school information, PPDB (Penerimaan Peserta Didik Baru) procedures, or academic schedules.
If a question is outside the scope of school information, PPDB, or academic schedules, politely state that you cannot answer it and suggest contacting the school directly.

User's question: {{{question}}}

Provide a clear and concise answer.`,
});

const visitorChatAssistantFlow = ai.defineFlow(
  {
    name: 'visitorChatAssistantFlow',
    inputSchema: VisitorChatAssistantInputSchema,
    outputSchema: VisitorChatAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
