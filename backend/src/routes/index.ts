import { Router } from 'express';
import { Routes } from '../utils/enums';
import authRouter from './auth';
import commentRouter from './comment';
import userRouter from './user';
import postRouter from './post';
import aiRouter from './ai';
import tagRouter from './tag';
import categoryRouter from './category';

const router = Router();

router.use(`/${Routes.USERS}`, userRouter);
router.use(`/${Routes.POSTS}`, postRouter);
router.use(`/${Routes.POSTS}`, commentRouter);
router.use(`/${Routes.AUTH}`, authRouter);
router.use(`/${Routes.AI}`, aiRouter);
router.use(`/${Routes.TAGS}`, tagRouter);
router.use(`/${Routes.CATEGORIES}`, categoryRouter);

export default router;
