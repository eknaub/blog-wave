import { Response } from 'express';
import { comments } from '../utils/mockData';
import { Comment, CommentUpdate } from '../utils/interfaces';
import { ValidatedRequest } from '../middleware/validation';
import prisma from '../prisma/client';

class CommentController {
  async getComments(
    req: ValidatedRequest<Comment, unknown, { postId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const postId = req.validatedParams!.postId;
      const comments = await prisma.comments.findMany({
        where: {
          post_id: postId,
        },
      });

      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error });
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
          post_id: validatedComment.postId,
          author_id: validatedComment.authorId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      res.status(201).json(createdComment);
    } catch (error) {
      res.status(500).json({ error });
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
          post_id: postId,
        },
      });

      if (!foundComment) {
        res.status(404).json({ error: 'Comment not found.' });
        return;
      }

      const updatedComment = await prisma.comments.update({
        where: {
          id: commentId,
        },
        data: {
          content: validatedComment.content,
          updated_at: new Date(),
        },
      });

      res.status(200).json(updatedComment);
    } catch (error) {
      res.status(500).json({ error });
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
          post_id: postId,
        },
      });

      if (!foundComment) {
        res.status(404).json({ error: 'Comment not found.' });
        return;
      }

      const deletedComment = await prisma.comments.delete({
        where: {
          id: commentId,
        },
      });

      res.status(200).json(deletedComment);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default CommentController;
