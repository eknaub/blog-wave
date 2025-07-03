import { Router } from 'express';
import UserController from '../controllers/user';
import {
  validateBody,
  validateParams,
  UserIdParamSchema,
} from '../middleware/validation';
import { UserUpdateSchema } from '../utils/interfaces';
import { requireAuth } from '../middleware/auth';

const router = Router();
const userController = new UserController();

router.get('/', userController.getUsers.bind(userController));
router.put(
  '/:userId',
  requireAuth,
  validateParams(UserIdParamSchema),
  validateBody(UserUpdateSchema),
  userController.putUser.bind(userController)
);
router.delete(
  '/:userId',
  requireAuth,
  validateParams(UserIdParamSchema),
  userController.deleteUser.bind(userController)
);

export default router;
