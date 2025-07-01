import { Router } from 'express';
import UserController from '../controllers/user';
import {
  validateBody,
  validateParams,
  UserIdParamSchema,
} from '../middleware/validation';
import { UserCreateSchema, UserUpdateSchema } from '../utils/interfaces';

const router = Router();
const userController = new UserController();

router.get('/', userController.getUsers.bind(userController));
router.post(
  '/',
  validateBody(UserCreateSchema),
  userController.postUser.bind(userController)
);
router.put(
  '/:userId',
  validateParams(UserIdParamSchema),
  validateBody(UserUpdateSchema),
  userController.putUser.bind(userController)
);
router.delete(
  '/:userId',
  validateParams(UserIdParamSchema),
  userController.deleteUser.bind(userController)
);

export default router;
