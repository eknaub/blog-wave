import { Router } from 'express';
import UserController from '../controllers/user';
import { validateBody, validateParams } from '../middleware/requestValidation';
import {
  UserIdParamSchema,
  UnfollowIdParamSchema,
} from '../middleware/requestParamValidation';
import { requireAuth } from '../middleware/auth';
import { RouteIds, UserRoutes } from '../utils/enums';
import { FollowerCreateSchema } from '../api/models/follower';
import { UserUpdateSchema } from '../api/models/user';

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
 * /api/users/{userId}/followers:
 *   post:
 *     tags:
 *       - Followers
 *     summary: Add a follower to a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to be followed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FollowerCreate'
 *     responses:
 *       201:
 *         description: Follower added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseFollower'
 *
 *   get:
 *     tags:
 *       - Followers
 *     summary: Get all followers of a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of followers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Follower'
 *
 * /api/users/{userId}/followers/{unfollowId}:
 *   delete:
 *     tags:
 *       - Followers
 *     summary: Remove a follower from a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *       - in: path
 *         name: unfollowId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the follower to remove
 *     responses:
 *       200:
 *         description: Follower removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseFollower'
 *
 * /api/users/{userId}/following:
 *   get:
 *     tags:
 *       - Followers
 *     summary: Get all users a user is following
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of users being followed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Follower'
 */

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', userController.getUsers.bind(userController));
userRouter.put(
  `/${RouteIds.USER_ID}`,
  requireAuth,
  validateParams(UserIdParamSchema),
  validateBody(UserUpdateSchema),
  userController.putUser.bind(userController)
);
userRouter.delete(
  `/${RouteIds.USER_ID}`,
  requireAuth,
  validateParams(UserIdParamSchema),
  userController.deleteUser.bind(userController)
);
userRouter.get(
  `/${RouteIds.USER_ID}`,
  requireAuth,
  validateParams(UserIdParamSchema),
  userController.getUser.bind(userController)
);
userRouter.post(
  `/${RouteIds.USER_ID}/${UserRoutes.FOLLOWERS}`,
  requireAuth,
  validateParams(UserIdParamSchema),
  validateBody(FollowerCreateSchema),
  userController.addFollower.bind(userController)
);
userRouter.delete(
  `/${RouteIds.USER_ID}/${UserRoutes.FOLLOWERS}/${RouteIds.UNFOLLOW_ID}`,
  requireAuth,
  validateParams(UnfollowIdParamSchema),
  userController.removeFollower.bind(userController)
);
userRouter.get(
  `/${RouteIds.USER_ID}/${UserRoutes.FOLLOWERS}`,
  requireAuth,
  validateParams(UserIdParamSchema),
  userController.getFollowers.bind(userController)
);
userRouter.get(
  `/${RouteIds.USER_ID}/${UserRoutes.FOLLOWING}`,
  requireAuth,
  validateParams(UserIdParamSchema),
  userController.getFollowing.bind(userController)
);

export default userRouter;
