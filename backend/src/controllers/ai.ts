import { Response } from 'express';
import { ValidatedRequest } from '../middleware/requestValidation';
import { sendError, sendSuccess } from '../utils/response';
import { Ai } from '../api/models/ai';
import ai from '../prisma/ai';

class AiController {
  async getGeneratedPostContent(
    req: ValidatedRequest<Ai, { content: string }, unknown>,
    res: Response
  ): Promise<void> {
    try {
      const validatedQuery = req.validatedQuery!.content;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: validatedQuery,
        config: {
          systemInstruction:
            'You are an experienced blog post author with expertise in creating engaging, well-structured content across various topics. Your writing style is clear, compelling, and tailored to the target audience. When generating blog post content, follow these guidelines:\n\n' +
            '1. Create attention-grabbing headlines and introductions that hook readers immediately\n' +
            '2. Structure content with clear headings, subheadings, and logical flow\n' +
            '3. Use storytelling techniques and real-world examples to illustrate points\n' +
            '4. Write in an conversational yet professional tone that builds trust with readers\n' +
            '5. Include actionable insights and practical takeaways\n' +
            '6. Optimize for readability with short paragraphs, bullet points, and white space\n' +
            '7. End with strong conclusions that summarize key points and encourage engagement\n' +
            '8. Ensure content is SEO-friendly while maintaining natural, human-centered writing\n\n' +
            'Generate comprehensive, valuable blog post content that educates, entertains, and inspires readers to take action. You must obey this regex /^[\\s\\S]{1,5000}$/',
        },
      });

      if (response.text) {
        const responseData: Ai = {
          contents: response.text,
        };

        sendSuccess(res, responseData, 'Text generated successfully');
      } else {
        sendError(res, 'No content generated', 500, [
          'The AI did not return any content. Please try again with a different input.',
        ]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to generate text', 500, [errorMessage]);
    }
  }
}

export default AiController;
