import { Response } from 'express';
import {
  Comment,
  CommentCreate,
  CommentUpdate,
  CommentVote,
} from '../api/models/comment';
import { ValidatedRequest } from '../middleware/requestValidation';
import prisma from '../prisma/client';
import {
  sendCreated,
  sendDeleted,
  sendSuccess,
  sendUpdated,
} from '../utils/response';
import {
  fetchCommentIfExists,
  fetchVotesByCommentId,
  mapCommentToDto,
} from './helpers/comment';
import { fetchUserIfExists } from './helpers/user';
import { fetchPostIfExists } from './helpers/post';
import { VoteType } from '@prisma/client';

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

      const commentObjects = await Promise.all(
        comments.map(async comment => {
          const commentVotes = await fetchVotesByCommentId(comment.id);
          return mapCommentToDto(comment, comment.author, commentVotes);
        })
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

      const initialCommentVotes: CommentVote[] = [];

      const sendComment: Comment = mapCommentToDto(
        createdComment,
        foundAuthor,
        initialCommentVotes
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

      const commentVotes = await fetchVotesByCommentId(commentId);

      const sendComment: Comment = mapCommentToDto(
        updatedComment,
        foundComment.author,
        commentVotes
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

      const commentVotes = await fetchVotesByCommentId(commentId);

      const sendComment: Comment = mapCommentToDto(
        deletedComment,
        foundComment.author,
        commentVotes
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

  async voteComment(
    req: ValidatedRequest<CommentVote, unknown, { commentId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const commentId = req.validatedParams!.commentId;
      const validatedVote: CommentVote = req.validatedBody!;
      const authUser = req.user as
        | { id: number; username: string; email: string }
        | undefined;

      const foundComment = await fetchCommentIfExists(commentId, res);
      if (!foundComment) {
        return;
      }

      const foundUser = await fetchUserIfExists(authUser?.id, res);
      if (!foundUser) {
        return;
      }

      const existingVote = await prisma.commentVotes.findFirst({
        where: {
          commentId: commentId,
          userId: foundUser.id,
        },
      });

      if (existingVote && existingVote.value === validatedVote.value) {
        await prisma.commentVotes.delete({
          where: { id: existingVote.id },
        });
        await prisma.comments.update({
          where: { id: commentId },
          data: { votesCount: { decrement: 1 } },
        });
      } else if (existingVote) {
        await prisma.commentVotes.update({
          where: { id: existingVote.id },
          data: { value: validatedVote.value },
        });
      } else {
        await prisma.commentVotes.create({
          data: {
            commentId: commentId,
            userId: foundUser.id,
            value: validatedVote.value,
          },
        });
      }

      if (validatedVote.value === 'LIKE') {
        await prisma.comments.update({
          where: { id: commentId },
          data: { votesCount: { increment: 1 } },
        });
      } else {
        await prisma.comments.update({
          where: { id: commentId },
          data: { votesCount: { decrement: 1 } },
        });
      }

      const votes = await fetchVotesByCommentId(commentId);

      const mappedComment = mapCommentToDto(foundComment, foundUser, votes);

      sendSuccess(res, mappedComment, 'Comment vote processed successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res.status(500).json({
        error: 'Failed to process comment vote',
        details: errorMessage,
      });
    }
  }

  async getCommentVotes(
    req: ValidatedRequest<
      unknown,
      { type: VoteType | undefined },
      { commentId: number }
    >,
    res: Response
  ): Promise<void> {
    try {
      const commentId = req.validatedParams!.commentId;
      const type = req.validatedQuery!.type;

      const foundComment = await fetchCommentIfExists(commentId, res);
      if (!foundComment) {
        return;
      }

      let votes = await prisma.commentVotes.findMany({
        where: { commentId: commentId, value: type },
      });

      if (type) {
        votes = votes.filter(vote => vote.value === type);
      }

      sendSuccess(res, votes, 'Comment votes retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      res.status(500).json({
        error: 'Failed to retrieve comment votes',
        details: errorMessage,
      });
    }
  }
}

export default CommentController;
