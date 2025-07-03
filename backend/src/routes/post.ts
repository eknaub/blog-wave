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

const router = Router();
const postController = new PostController();

router.get(
  '/',
  validateQuery(OptionalUserIdQuerySchema),
  postController.getPosts.bind(postController)
);
router.post(
  '/',
  validateBody(PostCreateSchema),
  postController.postPost.bind(postController)
);
router.put(
  '/:postId',
  validateParams(PostIdParamSchema),
  validateBody(PostUpdateSchema),
  postController.putPost.bind(postController)
);
router.patch(
  '/:postId/publish',
  validateParams(PostIdParamSchema),
  validateBody(PostPublishSchema),
  postController.publishPost.bind(postController)
);
router.delete(
  '/:postId',
  validateParams(PostIdParamSchema),
  postController.deletePost.bind(postController)
);

export default router;
