'use server';

/**
 * @fileOverview Moormy Bot - AI Chat Support Flow
 * 
 * This flow handles the chat interactions for Moormy Bot,
 * providing support and information to E-Moorm E-Commerce users.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string(),
});

const MoormyChatInputSchema = z.object({
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
  message: z.string().describe('The new message from the user.'),
});

export type MoormyChatInput = z.infer<typeof MoormyChatInputSchema>;

export async function moormyChat(input: MoormyChatInput): Promise<string> {
  return moormyChatFlow(input);
}

const moormyChatFlow = ai.defineFlow(
  {
    name: 'moormyChatFlow',
    inputSchema: MoormyChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const response = await ai.generate({
      system: `You are Moormy Bot, a friendly, helpful, and professional AI assistant for E-Moorm E-Commerce, the premier platform for local goods from Mindoro, Philippines. 
      
      Your goals:
      - Help users find local products (fresh produce, handicrafts, local delicacies).
      - Answer questions about stores like "Calapan Agri-Hub" or "Mangyan Heritage Crafts".
      - Be polite, concise, and use a helpful tone.
      - If you don't know something specific about an order, guide them to the help center.
      - Keep responses relatively short for a mobile-friendly chat experience.`,
      messages: [
        ...input.history.map((m) => ({
          role: m.role,
          content: [{ text: m.text }],
        })),
        { role: 'user', content: [{ text: input.message }] },
      ],
    });

    return response.text;
  }
);
