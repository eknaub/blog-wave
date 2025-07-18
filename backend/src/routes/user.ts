import { Router } from 'express';
import UserController from '../controllers/user';
import {
  validateBody,
  validateParams,
  UserIdParamSchema,
} from '../middleware/validation';
import { UserUpdateSchema } from '../api/interfaces';
import { requireAuth } from '../middleware/auth';

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 * /api/users/{userId}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserPut'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       204:
 *         description: User deleted
 *   get:
 *    tags:
 *      - Users
 *    summary: Get a user by ID
 *    parameters:
 *     - in: path
 *       name: userId
 *       required: true
 *       schema:
 *        type: integer
 *        description: ID of the user
 *    responses:
 *      200:
 *        description: User details
 *        content:
 *          application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 */

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
router.get(
  '/:userId',
  requireAuth,
  validateParams(UserIdParamSchema),
  userController.getUser.bind(userController)
);

export default router;
