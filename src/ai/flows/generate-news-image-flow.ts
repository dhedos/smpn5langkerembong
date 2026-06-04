'use server';
/**
 * @fileOverview A flow to generate news images based on a title.
 *
 * - generateNewsImage - Generates a base64 image from a text prompt.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageInputSchema = z.object({
  title: z.string().describe('The title of the news to generate an image for.'),
});

export async function generateNewsImage(input: { title: string }) {
  const { media } = await ai.generate({
    model: 'googleai/imagen-4.0-fast-generate-001',
    prompt: `A professional, high-quality, and modern illustration for a school news article with the title: "${input.title}". The style should be clean, educational, and suitable for a school website. No text in image.`,
  });

  if (!media) {
    throw new Error('Failed to generate image');
  }

  return { imageUrl: media.url };
}
