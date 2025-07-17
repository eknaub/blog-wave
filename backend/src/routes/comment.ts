import { Router } from 'express';
import { Routes } from '../utils/enums';
import CommentController from '../controllers/comment';
import {
  PostIdParamSchema,
  PostAndCommentIdParamSchema,
  validateBody,
  validateParams,
} from '../middleware/validation';
import { CommentCreateSchema, CommentUpdateSchema } from '../api/interfaces';
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

const router = Router();
const commentController = new CommentController();

router.get(
  `/:postId/${Routes.COMMENTS}`,
  validateParams(PostIdParamSchema),
  commentController.getComments.bind(commentController)
);
router.post(
  `/:postId/${Routes.COMMENTS}`,
  requireAuth,
  validateParams(PostIdParamSchema),
  validateBody(CommentCreateSchema),
  commentController.postComment.bind(commentController)
);
router.put(
  `/:postId/${Routes.COMMENTS}/:commentId`,
  requireAuth,
  validateParams(PostAndCommentIdParamSchema),
  validateBody(CommentUpdateSchema),
  commentController.putComment.bind(commentController)
);
router.delete(
  `/:postId/${Routes.COMMENTS}/:commentId`,
  requireAuth,
  validateParams(PostAndCommentIdParamSchema),
  commentController.deleteComment.bind(commentController)
);

export default router;
