import { Router } from 'express';
import userRoutes from './user';
import postRoutes from './post';
import authRoutes from './auth';
import commentRoutes from './comment';
import aiRoutes from './ai';
import { Routes } from '../utils/enums';

const router = Router();

router.use(`/${Routes.USERS}`, userRoutes);
router.use(`/${Routes.POSTS}`, postRoutes);
router.use(`/${Routes.POSTS}`, commentRoutes);
router.use(`/${Routes.AUTH}`, authRoutes);
router.use(`/${Routes.AI}`, aiRoutes);

export default router;
