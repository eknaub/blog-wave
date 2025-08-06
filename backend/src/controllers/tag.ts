import { Response } from 'express';
import { Tag } from '../api/models/tag';
import { ValidatedRequest } from '../middleware/requestValidation';
import prisma from '../prisma/client';
import {
  sendConflict,
  sendCreated,
  sendError,
  sendNotFound,
  sendSuccess,
  sendUpdated,
} from '../utils/response';

class TagController {
  async getTags(
    _req: ValidatedRequest<Tag, unknown, unknown>,
    res: Response
  ): Promise<void> {
    try {
      const tags = await prisma.tags.findMany();

      sendSuccess(res, tags, 'Tags retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to retrieve tags', 500, [errorMessage]);
    }
  }

  async postTag(
    req: ValidatedRequest<Tag, unknown, unknown>,
    res: Response
  ): Promise<void> {
    try {
      const validatedTag: Tag = { ...req.validatedBody! };

      const existingTag = await prisma.tags.findUnique({
        where: { name: validatedTag.name },
      });

      if (existingTag) {
        return sendConflict(
          res,
          `Tag with name "${validatedTag.name}" already exists`
        );
      }

      const newTag = await prisma.tags.create({
        data: {
          name: validatedTag.name,
          description: validatedTag.description ?? '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      sendCreated(res, newTag, 'Tag created successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to create tag', 500, [errorMessage]);
    }
  }

  async updateTag(
    req: ValidatedRequest<Tag, unknown, { tagId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const tagId = req.validatedParams!.tagId;
      const validatedTag: Tag = { ...req.validatedBody! };

      const existingTag = await prisma.tags.findUnique({
        where: { id: tagId },
      });

      if (!existingTag) {
        return sendNotFound(res, `Tag with ID "${tagId}" does not exist`);
      }

      const updatedTag = await prisma.tags.update({
        where: { id: tagId },
        data: {
          name: validatedTag.name,
          description: validatedTag.description ?? '',
          updatedAt: new Date(),
        },
      });

      sendUpdated(res, updatedTag, 'Tag updated successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to update tag', 500, [errorMessage]);
    }
  }

  async deleteTag(
    req: ValidatedRequest<unknown, unknown, { tagId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const tagId = req.validatedParams!.tagId;

      const existingTag = await prisma.tags.findUnique({
        where: { id: tagId },
      });

      if (!existingTag) {
        return sendNotFound(res, `Tag with ID "${tagId}" does not exist`);
      }

      const deletedTag = await prisma.tags.delete({
        where: { id: tagId },
      });

      sendSuccess(res, deletedTag, 'Tag deleted successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to delete tag', 500, [errorMessage]);
    }
  }

  async getTagById(
    req: ValidatedRequest<unknown, unknown, { tagId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const tagId = req.validatedParams!.tagId;

      const tag = await prisma.tags.findUnique({
        where: { id: tagId },
      });

      if (!tag) {
        return sendNotFound(res, `Tag with ID "${tagId}" does not exist`);
      }

      sendSuccess(res, tag, 'Tag retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to retrieve tag', 500, [errorMessage]);
    }
  }
}

export default TagController;
