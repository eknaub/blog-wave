import { Router } from "express";
import { Routes } from "../utils/enums";
import CommentController from "../controllers/comment";

const router = Router();
const postController = new CommentController();

router.get(
  `${Routes.POSTS}/:postId/${Routes.COMMENTS}`,
  postController.getComments.bind(postController)
);
router.post(
  `${Routes.POSTS}/:postId/${Routes.COMMENTS}`,
  postController.postComment.bind(postController)
);
router.put(
  `${Routes.POSTS}/:postId/${Routes.COMMENTS}/:commentId`,
  postController.putComment.bind(postController)
);
router.delete(
  `${Routes.POSTS}/:postId/${Routes.COMMENTS}/:commentId`,
  postController.deleteComment.bind(postController)
);

export default router;
