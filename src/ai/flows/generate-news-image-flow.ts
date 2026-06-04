'use server';
/**
 * @fileOverview A flow to generate news images based on a title.
 *
 * - generateNewsImage - Generates a base64 image from a text prompt using Imagen.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageInputSchema = z.object({
  title: z.string().describe('The title of the news to generate an image for.'),
});

export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const generateNewsImageFlow = ai.defineFlow(
  {
    name: 'generateNewsImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: z.object({
      imageUrl: z.string(),
    }),
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-3',
      prompt: `A professional, high-quality, and modern illustration for a school news article with the title: "${input.title}". The style should be clean, educational, and suitable for a school website. No text in image.`,
      config: {
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_ONLY_HIGH',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_ONLY_HIGH',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_ONLY_HIGH',
          },
        ],
      },
    });

    if (!media) {
      throw new Error('Failed to generate image from AI model');
    }

    return { imageUrl: media.url };
  }
);

export async function generateNewsImage(input: GenerateImageInput) {
  return generateNewsImageFlow(input);
}
