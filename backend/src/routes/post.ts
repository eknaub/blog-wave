import { Router } from 'express';
import PostController from '../controllers/post';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/requestValidation';
import { PostIdParamSchema } from '../middleware/requestParamValidation';
import { OptionalUserIdQuerySchema } from '../middleware/requestQueryValidation';
import { requireAuth } from '../middleware/auth';
import { PostCreateSchema, PostUpdateSchema } from '../api/models/post';
import { RouteIds } from '../utils/enums';

/**
 * @openapi
 * /api/posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get all posts
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter posts by user ID
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *   post:
 *     tags:
 *       - Posts
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostPost'
 *     responses:
 *       201:
 *         description: Post created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *
 * /api/posts/{postId}:
 *   put:
 *     tags:
 *       - Posts
 *     summary: Update a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostPut'
 *     responses:
 *       200:
 *         description: Post updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Delete a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Post deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */

const postRouter = Router();
const postController = new PostController();

postRouter.get(
  '/',
  validateQuery(OptionalUserIdQuerySchema),
  postController.getPosts.bind(postController)
);
postRouter.post(
  '/',
  requireAuth,
  validateBody(PostCreateSchema),
  postController.postPost.bind(postController)
);
postRouter.put(
  `/${RouteIds.POST_ID}`,
  requireAuth,
  validateParams(PostIdParamSchema),
  validateBody(PostUpdateSchema),
  postController.putPost.bind(postController)
);
postRouter.delete(
  `/${RouteIds.POST_ID}`,
  requireAuth,
  validateParams(PostIdParamSchema),
  postController.deletePost.bind(postController)
);

export default postRouter;
