import { Router } from 'express';
import AiController from '../controllers/ai';
import { AiContentParamSchema, validateQuery } from '../middleware/validation';

const router = Router();
const aiController = new AiController();

router.get(
  '/',
  validateQuery(AiContentParamSchema),
  aiController.getGeneratedPostContent.bind(aiController)
);

export default router;
