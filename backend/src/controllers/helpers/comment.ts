import { fetchPostIfExists } from './post';
import prisma from '../../prisma/client';
import { Response } from 'express';
import { sendNotFound } from '../../utils/response';
import { fetchUserIfExists } from './user';
import { UserDetail } from '../../api/models/user';
import { Comment } from '../../api/models/comment';

export interface PrismaReturnedComment {
  id: number;
  content: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  postId: number;
  authorId: number;
}

export function mapCommentToDto(
  comment: PrismaReturnedComment | Comment,
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
  };
}

export async function fetchCommentIfExists(
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

  const foundUser = await fetchUserIfExists(foundComment.authorId, res);
  if (!foundUser) {
    return null;
  }

  const foundPost = await fetchPostIfExists(foundComment.postId, res);
  if (!foundPost) {
    return null;
  }

  const comment = mapCommentToDto(foundComment, foundUser);

  return comment as Comment;
}
