import { Response } from 'express';
import { Post, PostCreate, PostUpdate } from '../api/interfaces';
import { ValidatedRequest } from '../middleware/validation';
import prisma from '../prisma/client';
import {
  sendCreated,
  sendDeleted,
  sendError,
  sendNotFound,
  sendSuccess,
  sendUpdated,
} from '../utils/response';

export function toPostDto(post: any, author: any): Post {
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

class PostController {
  async getPosts(
    req: ValidatedRequest<unknown, { userId: number | undefined }>,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.validatedQuery!.userId;
      let posts = await prisma.posts.findMany({
        where: userId ? { authorId: userId } : undefined,
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

      if (userId) {
        posts = posts.filter(post => post.authorId === userId);
      }

      const postObjects = posts.map(post => toPostDto(post, post.author));
      sendSuccess(res, postObjects, 'Posts retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to retrieve posts', 500, [errorMessage]);
    }
  }

  async postPost(
    req: ValidatedRequest<PostCreate>,
    res: Response
  ): Promise<void> {
    try {
      const validatedPost: PostCreate = req.validatedBody!;

      const foundAuthor = await prisma.users.findUnique({
        where: { id: validatedPost.authorId },
      });

      if (!foundAuthor) {
        sendNotFound(
          res,
          'Author not found. Please provide a valid author ID.'
        );
        return;
      }

      const createdPost = await prisma.posts.create({
        data: {
          title: validatedPost.title,
          content: validatedPost.content,
          authorId: validatedPost.authorId,
        },
      });

      const sendPost: Post = toPostDto(createdPost, foundAuthor);
      sendCreated(res, sendPost, 'Post created successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to create post', 500, [errorMessage]);
    }
  }

  async putPost(
    req: ValidatedRequest<PostUpdate, unknown, { postId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const postId = req.validatedParams!.postId;
      const validatedPost: PostUpdate = req.validatedBody!;
      const foundPost = await prisma.posts.findUnique({
        where: { id: postId },
      });
      const foundAuthor = await prisma.users.findUnique({
        where: { id: validatedPost.authorId },
      });

      if (!foundPost) {
        sendNotFound(res, 'Post not found. Please provide a valid post ID.');
        return;
      }

      if (!foundAuthor) {
        sendNotFound(res, 'Author not found.');
        return;
      }

      const updatedPost = await prisma.posts.update({
        where: { id: postId },
        data: {
          title: validatedPost.title,
          content: validatedPost.content,
          authorId: validatedPost.authorId,
          updatedAt: new Date(),
        },
      });

      const sendPost: Post = toPostDto(updatedPost, foundAuthor);
      sendUpdated(res, sendPost, 'Post updated successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to update post', 500, [errorMessage]);
    }
  }

  async deletePost(
    req: ValidatedRequest<Post, unknown, { postId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const postId = req.validatedParams!.postId;
      const foundPost = await prisma.posts.findUnique({
        where: { id: postId },
      });

      if (!foundPost) {
        sendNotFound(res, 'Post not found. Please provide a valid post ID.');
        return;
      }

      const foundAuthor = await prisma.users.findUnique({
        where: { id: foundPost.authorId },
      });

      if (!foundAuthor) {
        sendNotFound(res, 'Author not found.');
        return;
      }

      const deletedPost = await prisma.posts.delete({
        where: { id: postId },
      });

      const sendPost: Post = toPostDto(deletedPost, foundAuthor);
      sendDeleted(res, sendPost, 'Post deleted successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to delete post', 500, [errorMessage]);
    }
  }

  async publishPost(
    req: ValidatedRequest<Post, unknown, { postId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const postId = req.validatedParams!.postId;
      const { published } = req.validatedBody!;
      const foundPost = await prisma.posts.findUnique({
        where: { id: postId },
      });

      if (!foundPost) {
        sendNotFound(res, 'Post not found. Please provide a valid post ID.');
        return;
      }

      const foundAuthor = await prisma.users.findUnique({
        where: { id: foundPost.authorId },
      });

      if (!foundAuthor) {
        sendNotFound(res, 'Author not found.');
        return;
      }

      const updatedPost = await prisma.posts.update({
        where: { id: postId },
        data: {
          published,
          updatedAt: new Date(),
        },
      });

      const sendPost: Post = toPostDto(updatedPost, foundAuthor);
      sendUpdated(
        res,
        sendPost,
        'Post publication status updated successfully'
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to update post publication status', 500, [
        errorMessage,
      ]);
    }
  }
}

export default PostController;
