import { Router } from 'express';
import PostController from '../controllers/post';
import {
  OptionalUserIdQuerySchema,
  PostIdParamSchema,
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validation';
import { requireAuth } from '../middleware/auth';
import {
  PostCreateSchema,
  PostPublishSchema,
  PostUpdateSchema,
} from '../api/models/post';

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
 *
 * /api/posts/{postId}/publish:
 *   patch:
 *     tags:
 *       - Posts
 *     summary: Publish a post
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
 *         description: Post published
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */

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
