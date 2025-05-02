import OpenAI from "openai";
import { PROMPTS } from './prompts';

const client = new OpenAI();

export const generatePrompt = async (agent = 'poe') => {
  try {
    const promptGenerator = PROMPTS[agent];
    if (!promptGenerator) {
      throw new Error(`Unknown agent type: ${agent}`);
    }

    const roleDescription = promptGenerator();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: roleDescription
        },
        {
          role: "user",
          content: "Generate a visually rich story opening that will work well for both collaborative writing and AI image generation. Focus on concrete details and clear imagery."
        }
      ],
      temperature: 0.85,
      max_tokens: 150
    });

    const content = completion.choices[0].message.content.trim();
    
    // Remove any ellipses and clean up the text
    const cleanContent = content
      .replace(/\.{3,}/g, '.') // Replace ellipses with single period
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();

    return cleanContent;
  } catch (error) {
    console.error('Failed to generate prompt:', error);
    throw error;
  }
}
