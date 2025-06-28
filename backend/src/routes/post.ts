import { Router } from "express";
import { Routes } from "../utils/enums";
import PostController from "../controllers/post";

const router = Router();
const postController = new PostController();

router.get(`/${Routes.POSTS}`, postController.getPosts.bind(postController));
router.post(`/${Routes.POSTS}`, postController.postPost.bind(postController));
router.put(
  `/${Routes.POSTS}/:postId`,
  postController.putPost.bind(postController)
);
router.delete(
  `/${Routes.POSTS}/:postId`,
  postController.deletePost.bind(postController)
);

export default router;
