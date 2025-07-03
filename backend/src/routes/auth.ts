import { Router } from 'express';
import AuthController from '../controllers/auth';
import { validateBody } from '../middleware/validation';
import { UserCreateSchema, LoginSchema } from '../utils/interfaces';
import { requireAuth } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

router.post(
  '/register',
  validateBody(UserCreateSchema),
  authController.register.bind(authController)
);
router.post(
  '/login',
  validateBody(LoginSchema),
  authController.login.bind(authController)
);
router.post('/logout', requireAuth, authController.logout.bind(authController));
router.get(
  '/profile',
  requireAuth,
  authController.getProfile.bind(authController)
);

export default router;
