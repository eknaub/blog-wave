import { Response } from 'express';
import { Comment, CommentCreate, CommentUpdate } from '../api/interfaces';
import { ValidatedRequest } from '../middleware/validation';
import prisma from '../prisma/client';
import {
  sendCreated,
  sendDeleted,
  sendNotFound,
  sendSuccess,
  sendUpdated,
} from '../utils/response';
import { getCommentOrNotFound, toCommentDto } from './helpers/comment';
import { getPostOrNotFound } from './helpers/post';
import { getUserOrNotFound } from './helpers/user';

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
        include: {
          author: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
      });

      const foundPost = await getPostOrNotFound(postId, res);
      if (!foundPost) {
        // getPostOrNotFound already sends a response, just return
        return;
      }

      const commentObjects = comments.map(comment =>
        toCommentDto(comment, foundPost, comment.author)
      );
      sendSuccess(res, commentObjects, 'Comments retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res
        .status(500)
        .json({ error: 'Failed to retrieve comments', details: errorMessage });
    }
  }

  async postComment(
    req: ValidatedRequest<CommentCreate, unknown, { postId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const postId = req.validatedParams!.postId;
      const validatedComment: CommentCreate = { ...req.validatedBody!, postId };

      const foundAuthor = await getUserOrNotFound(
        validatedComment.authorId,
        res
      );
      if (!foundAuthor) {
        // getUserOrNotFound already sends a response, just return
        return;
      }

      const foundPost = await getPostOrNotFound(postId, res);
      if (!foundPost) {
        // getPostOrNotFound already sends a response, just return
        return;
      }

      const createdComment = await prisma.comments.create({
        data: {
          content: validatedComment.content,
          postId: validatedComment.postId,
          authorId: validatedComment.authorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const sendComment: Comment = toCommentDto(
        createdComment,
        foundPost,
        foundAuthor
      );
      sendCreated(res, sendComment, 'Comment created successfully');
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
      CommentUpdate,
      unknown,
      { postId: number; commentId: number }
    >,
    res: Response
  ): Promise<void> {
    try {
      const postId = req.validatedParams!.postId;
      const commentId = req.validatedParams!.commentId;
      const validatedComment: CommentUpdate = req.validatedBody!;

      const foundComment = await getCommentOrNotFound(commentId, res);
      if (!foundComment) {
        // getCommentOrNotFound already sends a response, just return
        return;
      }

      const foundPost = await getPostOrNotFound(postId, res);
      if (!foundPost) {
        // getPostOrNotFound already sends a response, just return
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

      const sendComment: Comment = toCommentDto(
        updatedComment,
        foundPost,
        foundComment.author
      );
      sendUpdated(res, sendComment, 'Comment updated successfully');
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

      const foundComment = await getCommentOrNotFound(commentId, res);
      if (!foundComment) {
        // getCommentOrNotFound already sends a response, just return
        return;
      }

      const foundPost = await getPostOrNotFound(postId, res);
      if (!foundPost) {
        // getPostOrNotFound already sends a response, just return
        return;
      }

      const deletedComment = await prisma.comments.delete({
        where: {
          id: commentId,
        },
      });

      const sendComment: Comment = toCommentDto(
        deletedComment,
        foundPost,
        foundComment.author
      );
      sendDeleted(res, sendComment, 'Comment deleted successfully');
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
