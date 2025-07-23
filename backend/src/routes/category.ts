import { Router } from 'express';
import CategoryController from '../controllers/category';
import { validateBody, validateParams } from '../middleware/requestValidation';
import { CategoryPostSchema, CategoryPutSchema } from '../api/models/category';
import { CategoryIdParamSchema } from '../middleware/requestParamValidation';

const categoryRouter = Router();
const categoryController = new CategoryController();

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryPost'
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *
 * /api/categories/{categoryId}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get category by ID
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *   put:
 *     tags:
 *       - Categories
 *     summary: Update category by ID
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryPut'
 *     responses:
 *       200:
 *         description: Category updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Delete category by ID
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Category deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */

categoryRouter.get(
  '/',
  categoryController.getCategories.bind(categoryController)
);
categoryRouter.post(
  '/',
  validateBody(CategoryPostSchema),
  categoryController.postCategory.bind(categoryController)
);
categoryRouter.put(
  '/:categoryId',
  validateBody(CategoryPutSchema),
  validateParams(CategoryIdParamSchema),
  categoryController.updateCategory.bind(categoryController)
);
categoryRouter.delete(
  '/:categoryId',
  validateParams(CategoryIdParamSchema),
  categoryController.deleteCategory.bind(categoryController)
);
categoryRouter.get(
  '/:categoryId',
  validateParams(CategoryIdParamSchema),
  categoryController.getCategoryById.bind(categoryController)
);

export default categoryRouter;
