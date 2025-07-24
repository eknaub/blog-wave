import { Router } from 'express';
import { RouteIds, Routes } from '../utils/enums';
import CommentController from '../controllers/comment';
import { validateBody, validateParams } from '../middleware/requestValidation';
import {
  PostIdParamSchema,
  PostAndCommentIdParamSchema,
} from '../middleware/requestParamValidation';
import {
  CommentCreateSchema,
  CommentUpdateSchema,
} from '../api/models/comment';
import { requireAuth } from '../middleware/auth';

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
 */

const commentRouter = Router();
const commentController = new CommentController();

commentRouter.get(
  `/${RouteIds.POST_ID}/${Routes.COMMENTS}`,
  requireAuth,
  validateParams(PostIdParamSchema),
  commentController.getComments.bind(commentController)
);
commentRouter.post(
  `/${RouteIds.POST_ID}/${Routes.COMMENTS}`,
  requireAuth,
  validateParams(PostIdParamSchema),
  validateBody(CommentCreateSchema),
  commentController.postComment.bind(commentController)
);
commentRouter.put(
  `/${RouteIds.POST_ID}/${Routes.COMMENTS}/${RouteIds.COMMENT_ID}`,
  requireAuth,
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

export default commentRouter;
