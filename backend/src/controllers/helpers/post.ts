import prisma from '../../prisma/client';
import { Response } from 'express';
import { sendNotFound } from '../../utils/response';
import { Post, User, UserDetail } from '../../api/interfaces';
import { getUserOrNotFound } from './user';

export interface PrismaReturnedPost {
  id: number;
  title: string;
  content: string;
  published: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  authorId: number;
}

export function toPostDto(
  post: PrismaReturnedPost | Post,
  author: User | UserDetail
): Post {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    published: post.published ?? false,
    author: {
      id: author.id,
      username: author.username,
      email: author.email,
    },
    createdAt: post.createdAt ?? new Date(),
    updatedAt: post.updatedAt ?? new Date(),
  };
}

export async function getPostOrNotFound(
  postId: number | undefined,
  res: Response
): Promise<Post | null> {
  if (!postId) {
    sendNotFound(res, 'Post ID is required.');
    return null;
  }

  const baseSelect = {
    id: true,
    title: true,
    content: true,
    published: true,
    createdAt: true,
    updatedAt: true,
    authorId: true,
  };

  const foundPost = await prisma.posts.findUnique({
    select: baseSelect,
    where: { id: postId },
  });

  if (!foundPost) {
    sendNotFound(res, 'Post not found. Please provide a valid post ID.');
    return null;
  }

  const foundUser = await getUserOrNotFound(foundPost.authorId, res);
  if (!foundUser) {
    // getUserOrNotFound already sends a response, just return
    return null;
  }

  // Return the found post with the user information
  const post = toPostDto(foundPost, foundUser);

  return post;
}
