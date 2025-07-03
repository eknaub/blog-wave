import { Response } from 'express';
import { Post, PostUpdate } from '../utils/interfaces';
import { ValidatedRequest } from '../middleware/validation';
import prisma from '../prisma/client';
import {
  sendConflict,
  sendCreated,
  sendDeleted,
  sendError,
  sendNotFound,
  sendSuccess,
  sendUpdated,
} from '../utils/response';

class PostController {
  async getPosts(
    req: ValidatedRequest<unknown, { userId: number | undefined }>,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.validatedQuery!.userId;
      let posts = await prisma.posts.findMany({
        where: userId ? { author_id: userId } : undefined,
      });

      if (userId) {
        posts = posts.filter(post => post.author_id === userId);
      }

      sendSuccess(res, posts, 'Posts retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to retrieve posts', 500, [errorMessage]);
    }
  }

  async postPost(req: ValidatedRequest<Post>, res: Response): Promise<void> {
    try {
      const validatedPost: Post = req.validatedBody!;
      const foundPost = await prisma.posts.findFirst({
        where: { id: validatedPost.id },
      });

      if (foundPost) {
        sendConflict(
          res,
          'Post with this ID already exists. Please use a different ID.'
        );
        return;
      }

      const foundAuthor = await prisma.users.findFirst({
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
          author_id: validatedPost.authorId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      sendCreated(res, createdPost, 'Post created successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to create post', 500, [errorMessage]);
    }
  }

  async putPost(
    req: ValidatedRequest<Post, unknown, { postId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const postId = req.validatedParams!.postId;
      const validatedPost: PostUpdate = req.validatedBody!;
      const foundPost = await prisma.posts.findFirst({
        where: { id: postId },
      });

      if (!foundPost) {
        sendNotFound(res, 'Post not found. Please provide a valid post ID.');
        return;
      }

      const updatedPost = await prisma.posts.update({
        where: { id: postId },
        data: {
          title: validatedPost.title,
          content: validatedPost.content,
          author_id: validatedPost.authorId,
          updated_at: new Date(),
        },
      });

      sendUpdated(res, updatedPost, 'Post updated successfully');
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
      const foundPost = await prisma.posts.findFirst({
        where: { id: postId },
      });

      if (!foundPost) {
        sendNotFound(res, 'Post not found. Please provide a valid post ID.');
        return;
      }

      const deletedPost = await prisma.posts.delete({
        select: {
          id: true,
          title: true,
          content: true,
          author_id: true,
          created_at: true,
          updated_at: true,
        },
        where: { id: postId },
      });

      sendDeleted(res, deletedPost, 'Post deleted successfully');
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
      const foundPost = await prisma.posts.findFirst({
        where: { id: postId },
      });

      if (!foundPost) {
        sendNotFound(res, 'Post not found. Please provide a valid post ID.');
        return;
      }

      const updatedPost = await prisma.posts.update({
        where: { id: postId },
        data: {
          published,
          updated_at: new Date(),
        },
      });

      sendUpdated(
        res,
        updatedPost,
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
