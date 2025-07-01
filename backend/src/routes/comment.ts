import { Router } from 'express';
import { Routes } from '../utils/enums';
import CommentController from '../controllers/comment';
import {
  PostIdParamSchema,
  PostAndCommentIdParamSchema,
  validateBody,
  validateParams,
} from '../middleware/validation';
import { CommentCreateSchema, CommentUpdateSchema } from '../utils/interfaces';

const router = Router();
const commentController = new CommentController();

router.get(
  `/:postId/${Routes.COMMENTS}`,
  validateParams(PostIdParamSchema),
  commentController.getComments.bind(commentController)
);
router.post(
  `/:postId/${Routes.COMMENTS}`,
  validateParams(PostIdParamSchema),
  validateBody(CommentCreateSchema),
  commentController.postComment.bind(commentController)
);
router.put(
  `/:postId/${Routes.COMMENTS}/:commentId`,
  validateParams(PostAndCommentIdParamSchema),
  validateBody(CommentUpdateSchema),
  commentController.putComment.bind(commentController)
);
router.delete(
  `/:postId/${Routes.COMMENTS}/:commentId`,
  validateParams(PostAndCommentIdParamSchema),
  commentController.deleteComment.bind(commentController)
);

export default router;
