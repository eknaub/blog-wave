import { Router } from 'express';
import PostController from '../controllers/post';
import {
  OptionalUserIdQuerySchema,
  PostIdParamSchema,
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validation';
import {
  PostCreateSchema,
  PostPublishSchema,
  PostUpdateSchema,
} from '../utils/interfaces';
import { requireAuth } from '../middleware/auth';

const router = Router();
const postController = new PostController();

router.get(
  '/',
  validateQuery(OptionalUserIdQuerySchema),
  postController.getPosts.bind(postController)
);
router.post(
  '/',
  requireAuth,
  validateBody(PostCreateSchema),
  postController.postPost.bind(postController)
);
router.put(
  '/:postId',
  requireAuth,
  validateParams(PostIdParamSchema),
  validateBody(PostUpdateSchema),
  postController.putPost.bind(postController)
);
router.patch(
  '/:postId/publish',
  requireAuth,
  validateParams(PostIdParamSchema),
  validateBody(PostPublishSchema),
  postController.publishPost.bind(postController)
);
router.delete(
  '/:postId',
  requireAuth,
  validateParams(PostIdParamSchema),
  postController.deletePost.bind(postController)
);

export default router;
