import { Router } from "express";
import { Routes } from "../utils/enums";
import CommentController from "../controllers/comment";

const router = Router();
const commentController = new CommentController();

router.get(
  `/:postId/${Routes.COMMENTS}`,
  commentController.getComments.bind(commentController)
);
router.post(
  `/:postId/${Routes.COMMENTS}`,
  commentController.postComment.bind(commentController)
);
router.put(
  `/:postId/${Routes.COMMENTS}/:commentId`,
  commentController.putComment.bind(commentController)
);
router.delete(
  `/:postId/${Routes.COMMENTS}/:commentId`,
  commentController.deleteComment.bind(commentController)
);

export default router;
