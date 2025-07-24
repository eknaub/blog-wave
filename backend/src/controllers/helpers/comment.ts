import { fetchPostIfExists, mapPostToDto, PrismaReturnedPost } from './post';
import prisma from '../../prisma/client';
import { Response } from 'express';
import { sendNotFound } from '../../utils/response';
import { fetchUserIfExists } from './user';
import { Post } from '../../api/models/post';
import { UserDetail } from '../../api/models/user';
import { Comment } from '../../api/models/comment';
import { fetchTagsByPostId } from './tag';
import { fetchCategoriesByPostId } from './category';

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
    post: mapPostToDto(
      post,
      author,
      'categories' in post ? post.categories : [],
      'tags' in post ? post.tags : []
    ),
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

  const categories = await fetchCategoriesByPostId(foundPost.id);
  const tags = await fetchTagsByPostId(foundPost.id);

  const post = mapPostToDto(foundPost, foundUser, categories, tags);

  const comment = mapCommentToDto(foundComment, post, foundUser);

  return comment as Comment;
}
