import { Router } from 'express';
import { RouteIds, Routes } from '../utils/routeEnums';
import CommentController from '../controllers/comment';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/requestValidation';
import {
  PostIdParamSchema,
  PostAndCommentIdParamSchema,
} from '../middleware/requestParamValidation';
import {
  CommentCreateSchema,
  CommentUpdateSchema,
  CommentVoteUpdateSchema,
} from '../api/models/comment';
import { requireAuth } from '../middleware/auth';
import { OptionalVotesQuerySchema } from '../middleware/requestQueryValidation';
import { moderateContent } from '../middleware/moderateContent';

/**
 * @openapi
 * /api/posts/{postId}/comments:
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get all comments for a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *   post:
 *     tags:
 *       - Comments
 *     summary: Create a new comment for a post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentPost'
 *     responses:
 *       201:
 *         description: Comment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *
 * /api/posts/{postId}/comments/{commentId}:
 *   put:
 *     tags:
 *       - Comments
 *     summary: Update a comment
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentPut'
 *     responses:
 *       200:
 *         description: Comment updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Delete a comment
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Comment deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 * /api/posts/{postId}/comments/{commentId}/votes:
 *  post:
 *    tags:
 *      - Comments
 *    summary: Vote (like or dislike) on a comment for a post
 *    parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CommentVoteUpdate'
 *    responses:
 *      200:
 *        description: Vote registered and comment returned
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Comment'
 *      400:
 *        description: Invalid vote or already voted this way
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Comment not found
 *  get:
 *    tags:
 *      - Comments
 *    summary: Get all votes for comments on a post (likes/dislikes)
 *    parameters:
 *      - in: path
 *        name: postId
 *        required: true
 *        schema:
 *          type: integer
 *      - in: path
 *        name: commentId
 *        required: true
 *        schema:
 *          type: integer
 *      - in: query
 *        name: type
 *        required: false
 *        schema:
 *          type: string
 *          enum: [LIKE, DISLIKE]
 *        description: Filter by vote type (LIKE or DISLIKE)
 *    responses:
 *      200:
 *        description: List of votes for comments on the post
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/CommentVote'
 *      401:
 *        description: Unauthorized
 *      404:
 *        description: Post or comment not found
 */

const commentRouter = Router();
const commentController = new CommentController();

commentRouter.get(
  `/${RouteIds.POST_ID}/${Routes.COMMENTS}`,
  validateParams(PostIdParamSchema),
  commentController.getComments.bind(commentController)
);
commentRouter.post(
  `/${RouteIds.POST_ID}/${Routes.COMMENTS}`,
  requireAuth,
  moderateContent,
  validateParams(PostIdParamSchema),
  validateBody(CommentCreateSchema),
  commentController.postComment.bind(commentController)
);
commentRouter.put(
  `/${RouteIds.POST_ID}/${Routes.COMMENTS}/${RouteIds.COMMENT_ID}`,
  requireAuth,
  moderateContent,
  validateParams(PostAndCommentIdParamSchema),
  validateBody(CommentUpdateSchema),
  commentController.putComment.bind(commentController)
);
commentRouter.delete(
  `/${RouteIds.POST_ID}/${Routes.COMMENTS}/${RouteIds.COMMENT_ID}`,
  requireAuth,
  validateParams(PostAndCommentIdParamSchema),
  commentController.deleteComment.bind(commentController)
);
commentRouter.post(
  `/${RouteIds.POST_ID}/${Routes.COMMENTS}/${RouteIds.COMMENT_ID}/${Routes.VOTES}`,
  requireAuth,
  validateParams(PostAndCommentIdParamSchema),
  validateBody(CommentVoteUpdateSchema),
  commentController.voteComment.bind(commentController)
);
commentRouter.get(
  `/${RouteIds.POST_ID}/${Routes.COMMENTS}/${RouteIds.COMMENT_ID}/${Routes.VOTES}`,
  requireAuth,
  validateParams(PostAndCommentIdParamSchema),
  validateQuery(OptionalVotesQuerySchema),
  commentController.getCommentVotes.bind(commentController)
);

export default commentRouter;
