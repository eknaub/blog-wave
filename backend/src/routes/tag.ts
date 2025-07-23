import { Router } from 'express';
import TagController from '../controllers/tag';
import { validateBody, validateParams } from '../middleware/requestValidation';
import { TagIdParamSchema } from '../middleware/requestParamValidation';
import { TagPostSchema, TagPutSchema } from '../api/models/tag';

const tagRouter = Router();
const tagController = new TagController();

/**
 * @openapi
 * /api/tags:
 *   get:
 *     tags:
 *       - Tags
 *     summary: Get all tags
 *     responses:
 *       200:
 *         description: List of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *   post:
 *     tags:
 *       - Tags
 *     summary: Create a new tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagPost'
 *     responses:
 *       201:
 *         description: Tag created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *
 * /api/tags/{tagId}:
 *   get:
 *     tags:
 *       - Tags
 *     summary: Get tag by ID
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tag found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag not found
 *   put:
 *     tags:
 *       - Tags
 *     summary: Update tag by ID
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagPut'
 *     responses:
 *       200:
 *         description: Tag updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag not found
 *   delete:
 *     tags:
 *       - Tags
 *     summary: Delete tag by ID
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tag deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag not found
 */

tagRouter.get('/', tagController.getTags.bind(tagController));
tagRouter.post(
  '/',
  validateBody(TagPostSchema),
  tagController.postTag.bind(tagController)
);
tagRouter.put(
  '/:tagId',
  validateBody(TagPutSchema),
  validateParams(TagIdParamSchema),
  tagController.updateTag.bind(tagController)
);
tagRouter.delete(
  '/:tagId',
  validateParams(TagIdParamSchema),
  tagController.deleteTag.bind(tagController)
);
tagRouter.get(
  '/:tagId',
  validateParams(TagIdParamSchema),
  tagController.getTagById.bind(tagController)
);

export default tagRouter;
