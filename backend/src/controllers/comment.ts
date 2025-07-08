import { Response } from 'express';
import { Comment, CommentUpdate } from '../utils/interfaces';
import { ValidatedRequest } from '../middleware/validation';
import prisma from '../prisma/client';
import {
  sendCreated,
  sendDeleted,
  sendNotFound,
  sendSuccess,
  sendUpdated,
} from '../utils/response';

class CommentController {
  async getComments(
    req: ValidatedRequest<Comment, unknown, { postId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const postId = req.validatedParams!.postId;
      const comments = await prisma.comments.findMany({
        where: {
          postId: postId,
        },
      });

      sendSuccess(res, comments, 'Comments retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res
        .status(500)
        .json({ error: 'Failed to retrieve comments', details: errorMessage });
    }
  }

  async postComment(
    req: ValidatedRequest<Comment, unknown, { postId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const postId = req.validatedParams!.postId;
      const validatedComment: Comment = { ...req.validatedBody!, postId };

      const createdComment = await prisma.comments.create({
        data: {
          content: validatedComment.content,
          postId: validatedComment.postId,
          authorId: validatedComment.authorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      sendCreated(res, createdComment, 'Comment created successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res
        .status(500)
        .json({ error: 'Failed to create comment', details: errorMessage });
    }
  }

  async putComment(
    req: ValidatedRequest<
      Comment,
      unknown,
      { postId: number; commentId: number }
    >,
    res: Response
  ): Promise<void> {
    try {
      const postId = req.validatedParams!.postId;
      const commentId = req.validatedParams!.commentId;
      const validatedComment: CommentUpdate = req.validatedBody!;
      const foundComment = await prisma.comments.findFirst({
        where: {
          id: commentId,
          postId: postId,
        },
      });

      if (!foundComment) {
        sendNotFound(res, 'Comment not found');
        return;
      }

      const updatedComment = await prisma.comments.update({
        where: {
          id: commentId,
        },
        data: {
          content: validatedComment.content,
          updatedAt: new Date(),
        },
      });

      sendUpdated(res, updatedComment, 'Comment updated successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res
        .status(500)
        .json({ error: 'Failed to update comment', details: errorMessage });
    }
  }

  async deleteComment(
    req: ValidatedRequest<
      Comment,
      unknown,
      { postId: number; commentId: number }
    >,
    res: Response
  ): Promise<void> {
    try {
      const postId = req.validatedParams!.postId;
      const commentId = req.validatedParams!.commentId;
      const foundComment = await prisma.comments.findFirst({
        where: {
          id: commentId,
          postId: postId,
        },
      });

      if (!foundComment) {
        sendNotFound(res, 'Comment not found');
        return;
      }

      const deletedComment = await prisma.comments.delete({
        where: {
          id: commentId,
        },
      });

      sendDeleted(res, deletedComment, 'Comment deleted successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res
        .status(500)
        .json({ error: 'Failed to delete comment', details: errorMessage });
    }
  }
}

export default CommentController;
