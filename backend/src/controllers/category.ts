import { Response } from 'express';
import { Category, CategoryPost, CategoryPut } from '../api/models/category';
import { ValidatedRequest } from '../middleware/requestValidation';
import prisma from '../prisma/client';
import {
  sendConflict,
  sendCreated,
  sendDeleted,
  sendError,
  sendNotFound,
  sendSuccess,
  sendUpdated,
} from '../utils/response';

class CategoryController {
  async getCategories(
    _req: ValidatedRequest<Category, unknown, unknown>,
    res: Response
  ): Promise<void> {
    try {
      const categories = await prisma.category.findMany();

      sendSuccess(res, categories, 'Categories retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to retrieve categories', 500, [errorMessage]);
    }
  }

  async postCategory(
    req: ValidatedRequest<CategoryPost, unknown, unknown>,
    res: Response
  ): Promise<void> {
    try {
      const validatedCategory: CategoryPost = { ...req.validatedBody! };

      const existingCategory = await prisma.category.findUnique({
        where: { name: validatedCategory.name },
      });

      if (existingCategory) {
        return sendConflict(
          res,
          `Category with name "${validatedCategory.name}" already exists`
        );
      }

      const newCategory = await prisma.category.create({
        data: {
          name: validatedCategory.name,
          description: validatedCategory.description ?? '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      sendCreated(res, newCategory, 'Category created successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to create category', 500, [errorMessage]);
    }
  }

  async updateCategory(
    req: ValidatedRequest<CategoryPut, unknown, { categoryId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const validatedCategory: CategoryPut = { ...req.validatedBody! };
      const categoryId = req.validatedParams!.categoryId;

      const existingCategory = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!existingCategory) {
        return sendNotFound(
          res,
          `Category with ID "${categoryId}" does not exist`
        );
      }

      const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: {
          name: validatedCategory.name,
          description: validatedCategory.description ?? '',
          updatedAt: new Date(),
        },
      });

      sendUpdated(res, updatedCategory, 'Category updated successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to update category', 500, [errorMessage]);
    }
  }

  async deleteCategory(
    req: ValidatedRequest<unknown, unknown, { categoryId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const categoryId = req.validatedParams!.categoryId;

      const existingCategory = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!existingCategory) {
        return sendNotFound(
          res,
          `Category with ID "${categoryId}" does not exist`
        );
      }

      const deletedCategory = await prisma.category.delete({
        where: { id: categoryId },
      });

      sendDeleted(res, deletedCategory, 'Category deleted successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to delete category', 500, [errorMessage]);
    }
  }

  async getCategoryById(
    req: ValidatedRequest<unknown, unknown, { categoryId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const categoryId = req.validatedParams!.categoryId;

      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return sendNotFound(
          res,
          `Category with ID "${categoryId}" does not exist`
        );
      }

      sendSuccess(res, category, 'Category retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to retrieve category', 500, [errorMessage]);
    }
  }
}

export default CategoryController;
