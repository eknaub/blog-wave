import { Router } from "express";
import UserController from "../controllers/user";
import { Routes } from "../utils/enums";

const router = Router();
const userController = new UserController();

router.get(`/${Routes.USERS}`, userController.getUsers.bind(userController));
router.post(`/${Routes.USERS}`, userController.postUser.bind(userController));
router.put(
  `/${Routes.USERS}/:userId`,
  userController.putUser.bind(userController)
);
router.delete(
  `/${Routes.USERS}/:userId`,
  userController.deleteUser.bind(userController)
);

export default router;
