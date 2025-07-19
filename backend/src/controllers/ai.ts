import { Response } from 'express';
import { ValidatedRequest } from '../middleware/validation';
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
            'You are a helpful assistant. Generate content based on the provided input. The input is the title for a blog post. You must obey this regex /^[\\s\\S]{1,5000}$/',
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
