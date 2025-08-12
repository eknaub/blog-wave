import { Router } from 'express';
import PostController from '../controllers/post';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/requestValidation';
import { PostIdParamSchema } from '../middleware/requestParamValidation';
import {
  OptionalUserIdAndPublishedQuerySchema,
  OptionalVotesQuerySchema,
} from '../middleware/requestQueryValidation';
import { requireAuth } from '../middleware/auth';
import {
  PostCreateSchema,
  PostUpdateSchema,
  PostVoteUpdateSchema,
} from '../api/models/post';
import { RouteIds, Routes } from '../utils/routeEnums';
import { moderateContent } from '../middleware/moderateContent';

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
 *       - in: query
 *         name: published
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter posts by published status
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
 * /api/posts/{postId}/votes:
 *  post:
 *    tags:
 *      - Posts
 *    summary: Vote (like or dislike) on a post
 *    parameters:
 *      - in: path
 *        name: postId
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID of the post to vote on
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/PostVoteUpdate'
 *    responses:
 *      200:
 *        description: Vote registered and post returned
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      400:
 *        description: Invalid vote or already voted this way
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Post not found
 *  get:
 *    tags:
 *      - Posts
 *    summary: Get all votes for a post (likes/dislikes)
 *    parameters:
 *      - in: path
 *        name: postId
 *        required: true
 *        schema:
 *          type: integer
 *        description: ID of the post
 *      - in: query
 *        name: type
 *        required: false
 *        schema:
 *          type: string
 *          enum: [LIKE, DISLIKE]
 *        description: Filter by vote type (LIKE or DISLIKE)
 *    responses:
 *      200:
 *        description: List of votes for the post
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/PostVote'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Post not found
 */

const postRouter = Router();
const postController = new PostController();

postRouter.get(
  '/',
  validateQuery(OptionalUserIdAndPublishedQuerySchema),
  postController.getPosts.bind(postController)
);
postRouter.post(
  '/',
  requireAuth,
  moderateContent,
  validateBody(PostCreateSchema),
  postController.postPost.bind(postController)
);
postRouter.put(
  `/${RouteIds.POST_ID}`,
  requireAuth,
  moderateContent,
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
postRouter.post(
  `/${RouteIds.POST_ID}/${Routes.VOTES}`,
  requireAuth,
  validateParams(PostIdParamSchema),
  validateBody(PostVoteUpdateSchema),
  postController.votePost.bind(postController)
);
postRouter.get(
  `/${RouteIds.POST_ID}/${Routes.VOTES}`,
  validateParams(PostIdParamSchema),
  validateQuery(OptionalVotesQuerySchema),
  postController.getPostVotes.bind(postController)
);

export default postRouter;
