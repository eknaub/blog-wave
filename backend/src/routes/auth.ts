import { Router } from 'express';
import AuthController from '../controllers/auth';
import { validateBody } from '../middleware/validation';
import { UserCreateSchema, LoginSchema } from '../api/interfaces';
import { requireAuth } from '../middleware/auth';

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPost'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout the current user
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       401:
 *         description: Unauthorized
 *
 * /api/auth/profile:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get the current user's profile
 *     responses:
 *       200:
 *         description: User profile returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */

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
