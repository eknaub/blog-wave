import { Router } from 'express';
import AiController from '../controllers/ai';
import { validateQuery } from '../middleware/requestValidation';
import { AiContentParamSchema } from '../middleware/requestParamValidation';

const aiRouter = Router();
const aiController = new AiController();

/**
 * @openapi
 * /api/ai:
 *   get:
 *     tags:
 *       - Ai
 *     summary: Generate AI content for a blog post
 *     description: Generates AI-generated content for a blog post based on provided input.
 *     parameters:
 *       - in: query
 *         name: content
 *         required: true
 *         schema:
 *           type: string
 *         description: The input text for AI content generation.
 *     responses:
 *       200:
 *         description: Successfully generated AI content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ai'
 */
aiRouter.get(
  '/',
  validateQuery(AiContentParamSchema),
  aiController.getGeneratedPostContent.bind(aiController)
);

export default aiRouter;
