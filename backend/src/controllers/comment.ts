import { Response } from 'express';
import {
  Comment,
  CommentCreate,
  CommentUpdate,
  UserDetail,
} from '../api/interfaces';
import { ValidatedRequest } from '../middleware/validation';
import prisma from '../prisma/client';
import {
  sendCreated,
  sendDeleted,
  sendNotFound,
  sendSuccess,
  sendUpdated,
} from '../utils/response';
import { PrismaReturnedPost, toPostDto } from './post';

export interface PrismaReturnedComment {
  id: number;
  content: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  postId: number;
  authorId: number;
}

export function toCommentDto(
  comment: PrismaReturnedComment,
  post: PrismaReturnedPost,
  author: UserDetail
): Comment {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt ?? new Date(),
    updatedAt: comment.updatedAt ?? new Date(),
    author: {
      id: author.id,
      username: author.username,
      email: author.email,
    },
    post: toPostDto(post, author),
  };
}

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

      const foundPost = await prisma.posts.findUnique({
        where: { id: postId },
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

      if (!foundPost) {
        sendNotFound(res, 'Post not found');
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

      const foundAuthor = await prisma.users.findUnique({
        where: { id: validatedComment.authorId },
      });

      if (!foundAuthor) {
        sendNotFound(
          res,
          'Author not found. Please provide a valid author ID.'
        );
        return;
      }

      const foundPost = await prisma.posts.findUnique({
        where: { id: postId },
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

      if (!foundPost) {
        sendNotFound(res, 'Post not found');
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
      const foundComment = await prisma.comments.findUnique({
        where: {
          id: commentId,
          postId: postId,
        },
      });

      if (!foundComment) {
        sendNotFound(res, 'Comment not found');
        return;
      }

      const foundAuthor = await prisma.users.findUnique({
        where: { id: validatedComment.authorId },
      });

      if (!foundAuthor) {
        sendNotFound(
          res,
          'Author not found. Please provide a valid author ID.'
        );
        return;
      }

      const foundPost = await prisma.posts.findUnique({
        where: { id: postId },
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

      if (!foundPost) {
        sendNotFound(res, 'Post not found');
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
        foundAuthor
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
      const foundComment = await prisma.comments.findUnique({
        where: {
          id: commentId,
          postId: postId,
        },
      });

      if (!foundComment) {
        sendNotFound(res, 'Comment not found');
        return;
      }

      const foundAuthor = await prisma.users.findUnique({
        where: { id: foundComment.authorId },
      });

      if (!foundAuthor) {
        sendNotFound(
          res,
          'Author not found. Please provide a valid author ID.'
        );
        return;
      }

      const foundPost = await prisma.posts.findUnique({
        where: { id: postId },
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

      if (!foundPost) {
        sendNotFound(res, 'Post not found');
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
        foundAuthor
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
