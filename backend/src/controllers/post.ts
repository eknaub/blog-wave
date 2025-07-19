import { Response } from 'express';
import { Post, PostCreate, PostUpdate } from '../api/models/post';
import { ValidatedRequest } from '../middleware/validation';
import prisma from '../prisma/client';
import {
  sendCreated,
  sendDeleted,
  sendError,
  sendSuccess,
  sendUpdated,
} from '../utils/response';
import { getUserOrNotFound } from './helpers/user';
import { getPostOrNotFound, toPostDto } from './helpers/post';

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
      const foundUser = await getUserOrNotFound(validatedPost.authorId, res);
      if (!foundUser) {
        // getUserOrNotFound already sends a response, just return
        return;
      }

      const createdPost = await prisma.posts.create({
        data: {
          title: validatedPost.title,
          content: validatedPost.content,
          authorId: validatedPost.authorId,
        },
      });

      const sendPost: Post = toPostDto(createdPost, foundUser);
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

      const foundPost = await getPostOrNotFound(postId, res);
      if (!foundPost) {
        // getPostOrNotFound already sends a response, just return
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

      const sendPost: Post = toPostDto(updatedPost, foundPost.author);
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

      const foundPost = await getPostOrNotFound(postId, res);
      if (!foundPost) {
        // getPostOrNotFound already sends a response, just return
        return;
      }

      const deletedPost = await prisma.posts.delete({
        where: { id: postId },
      });

      const sendPost: Post = toPostDto(deletedPost, foundPost.author);
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

      const foundPost = await getPostOrNotFound(postId, res);
      if (!foundPost) {
        // getPostOrNotFound already sends a response, just return
        return;
      }

      const updatedPost = await prisma.posts.update({
        where: { id: postId },
        data: {
          published,
          updatedAt: new Date(),
        },
      });

      const sendPost: Post = toPostDto(updatedPost, foundPost.author);
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
