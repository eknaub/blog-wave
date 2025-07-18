import { Comment, Post, UserDetail } from '../../api/interfaces';
import { getPostOrNotFound, PrismaReturnedPost, toPostDto } from './post';
import prisma from '../../prisma/client';
import { Response } from 'express';
import { sendNotFound } from '../../utils/response';
import { getUserOrNotFound } from './user';

export interface PrismaReturnedComment {
  id: number;
  content: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  postId: number;
  authorId: number;
}

export function toCommentDto(
  comment: PrismaReturnedComment | Comment,
  post: PrismaReturnedPost | Post,
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

export async function getCommentOrNotFound(
  commentId: number | undefined,
  res: Response
): Promise<Comment | null> {
  if (!commentId) {
    sendNotFound(res, 'Comment ID is required.');
    return null;
  }

  const baseSelect = {
    id: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    postId: true,
    authorId: true,
  };

  const foundComment = await prisma.comments.findUnique({
    select: baseSelect,
    where: { id: commentId },
  });

  if (!foundComment) {
    sendNotFound(res, 'Comment not found. Please provide a valid comment ID.');
    return null;
  }

  const foundUser = await getUserOrNotFound(foundComment.authorId, res);
  if (!foundUser) {
    // getUserOrNotFound already sends a response, just return
    return null;
  }

  const foundPost = await getPostOrNotFound(foundComment.postId, res);
  if (!foundPost) {
    // getPostOrNotFound already sends a response, just return
    return null;
  }
  const post = toPostDto(foundPost, foundUser);

  const comment = toCommentDto(foundComment, post, foundUser);

  return comment as Comment;
}
