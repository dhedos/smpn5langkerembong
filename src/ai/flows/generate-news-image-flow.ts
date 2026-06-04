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
      imageUrl: z.string().optional(),
      error: z.string().optional(),
    }),
  },
  async (input) => {
    try {
      // Menggunakan imagen-3 yang biasanya memiliki ketersediaan lebih luas
      const { media } = await ai.generate({
        model: 'googleai/imagen-3',
        prompt: `A professional, high-quality, and modern illustration for a school news article with the title: "${input.title}". The style should be clean, educational, and suitable for a school website. No text in image.`,
        config: {
          safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          ],
        },
      });

      if (!media || !media.url) {
        return { error: 'Model AI tidak mengembalikan gambar. Coba lagi nanti.' };
      }

      return { imageUrl: media.url };
    } catch (error: any) {
      console.error('AI Image Generation Error:', error);
      // Mengembalikan error sebagai data, bukan melempar exception agar UI tidak crash
      return { 
        error: error.message?.includes('403') 
          ? 'Akses AI Diblokir (403). Silakan aktifkan "Generative Language API" di Google Cloud Console.' 
          : 'Layanan AI sedang sibuk. Silakan coba unggah gambar secara manual.' 
      };
    }
  }
);

export async function generateNewsImage(input: GenerateImageInput) {
  return generateNewsImageFlow(input);
}
