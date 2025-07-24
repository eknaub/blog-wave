import { Response } from 'express';
import { Comment, CommentCreate, CommentUpdate } from '../api/models/comment';
import { ValidatedRequest } from '../middleware/requestValidation';
import prisma from '../prisma/client';
import {
  sendCreated,
  sendDeleted,
  sendSuccess,
  sendUpdated,
} from '../utils/response';
import { fetchCommentIfExists, mapCommentToDto } from './helpers/comment';
import { fetchUserIfExists } from './helpers/user';
import { fetchPostIfExists } from './helpers/post';

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

      const foundPost = await fetchPostIfExists(postId, res);
      if (!foundPost) {
        return;
      }

      const commentObjects = comments.map(comment =>
        mapCommentToDto(comment, foundPost, comment.author)
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

      const foundAuthor = await fetchUserIfExists(
        validatedComment.authorId,
        res
      );
      if (!foundAuthor) {
        return;
      }

      const foundPost = await fetchPostIfExists(postId, res);
      if (!foundPost) {
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

      const sendComment: Comment = mapCommentToDto(
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

      const foundComment = await fetchCommentIfExists(commentId, res);
      if (!foundComment) {
        return;
      }

      const foundPost = await fetchPostIfExists(postId, res);
      if (!foundPost) {
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

      const sendComment: Comment = mapCommentToDto(
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

      const foundComment = await fetchCommentIfExists(commentId, res);
      if (!foundComment) {
        return;
      }

      const foundPost = await fetchPostIfExists(postId, res);
      if (!foundPost) {
        return;
      }

      const deletedComment = await prisma.comments.delete({
        where: {
          id: commentId,
        },
      });

      const sendComment: Comment = mapCommentToDto(
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
