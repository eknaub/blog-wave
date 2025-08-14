import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client';
import { sendError } from '../utils/response';
import ai from '../prisma/ai';
import { inappropriateWords } from '@prisma/client';
import {
  InappropriateWordsResponse,
  InappropriateWordsResponseSchema,
} from '../api/models/inappropriateWords';

export async function moderateContent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const content: string = req.body.content || (req.query.content as string);

    if (!content) return next();

    // Check against existing inappropriate words
    const inappropriateWords: inappropriateWords[] =
      await prisma.inappropriateWords.findMany({
        where: { word: { in: content.toLowerCase().split(' ') } },
      });

    if (inappropriateWords.length > 0) {
      sendError(res, 'Inappropriate content detected', 400, [
        'Your content contains inappropriate language.',
        'Please remove the following words: ' +
          inappropriateWords.map(word => word.word).join(', '),
      ]);
      return;
    }

    // AI moderation fallback
    const moderationResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: content,
      config: {
        systemInstruction:
          'You are a content moderation AI. Analyze user input for inappropriate content (hate speech, harassment, explicit material). Respond in JSON:\n' +
          'If inappropriate: {"inappropriate": true, "words": ["badword1", "badword2"]}\n' +
          'If clean: {"inappropriate": false, "words": []}',
      },
    });

    if (moderationResponse.text) {
      const response: InappropriateWordsResponse =
        InappropriateWordsResponseSchema.parse(
          JSON.parse(moderationResponse.text)
        );
      if (response.inappropriate) {
        // Add new words to DB
        await prisma.inappropriateWords.createMany({
          data: response.words.map(word => ({ word })),
          skipDuplicates: true,
        });
        sendError(res, 'Inappropriate content detected', 400, [
          'Your content contains inappropriate language.',
          'Please remove the following words: ' + response.words.join(', '),
        ]);
        return;
      }
    }

    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to moderate content', 500, [errorMessage]);
    return;
  }
}
