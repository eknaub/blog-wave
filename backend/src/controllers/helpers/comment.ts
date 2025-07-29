import { fetchPostIfExists } from './post';
import prisma from '../../prisma/client';
import { Response } from 'express';
import { sendNotFound } from '../../utils/response';
import { fetchUserIfExists } from './user';
import { UserDetail } from '../../api/models/user';
import { Comment, CommentVote } from '../../api/models/comment';

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
  author: UserDetail,
  votes: CommentVote[]
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
    votesCount: getTotalVotes(votes),
  };
}

const getTotalVotes = (votes: CommentVote[]): number => {
  return votes.reduce((total, vote) => {
    return total + (vote.value === 'LIKE' ? 1 : -1);
  }, 0);
};

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

  const votes = await fetchVotesByCommentId(commentId);

  const comment = mapCommentToDto(foundComment, foundUser, votes);

  return comment as Comment;
}

export async function fetchVotesByCommentId(
  commentId: number | undefined
): Promise<CommentVote[]> {
  const fetchedVotes = await prisma.commentVotes.findMany({
    where: { commentId },
  });

  return fetchedVotes;
}

export function mapVotesToDto(votes: CommentVote[]): CommentVote[] {
  return votes.map(vote => ({
    id: vote.id,
    commentId: vote.commentId,
    userId: vote.userId,
    value: vote.value,
    createdAt: vote.createdAt,
    updatedAt: vote.updatedAt,
  }));
}
