import { Response } from 'express';
import { Post, PostCreate, PostUpdate } from '../api/models/post';
import { ValidatedRequest } from '../middleware/requestValidation';
import prisma from '../prisma/client';
import {
  sendCreated,
  sendDeleted,
  sendError,
  sendSuccess,
  sendUpdated,
} from '../utils/response';
import { fetchUserIfExists } from './helpers/user';
import {
  associatePostRelations,
  fetchPostIfExists,
  mapPostToDto,
} from './helpers/post';
import { fetchCategoriesByPostId } from './helpers/category';
import { fetchTagsByPostId } from './helpers/tag';

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

      const postObjects = await Promise.all(
        posts.map(async post => {
          const categories = await fetchCategoriesByPostId(post.id);
          const tags = await fetchTagsByPostId(post.id);
          return mapPostToDto(post, post.author, categories, tags);
        })
      );

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
      const foundUser = await fetchUserIfExists(validatedPost.authorId, res);
      if (!foundUser) {
        return;
      }

      const createdPost = await prisma.posts.create({
        data: {
          title: validatedPost.title,
          content: validatedPost.content,
          authorId: validatedPost.authorId,
          published: validatedPost.published ?? false,
        },
      });

      const { createdCategories, createdTags } = await associatePostRelations(
        createdPost.id,
        validatedPost.categories,
        validatedPost.tags
      );

      const sendPost: Post = mapPostToDto(
        createdPost,
        foundUser,
        createdCategories,
        createdTags
      );

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

      const foundPost = await fetchPostIfExists(postId, res);
      if (!foundPost) {
        return;
      }

      const updatedPost = await prisma.posts.update({
        where: { id: postId },
        data: {
          title: validatedPost.title,
          content: validatedPost.content,
          authorId: validatedPost.authorId,
          published: validatedPost.published,
          updatedAt: new Date(),
        },
      });

      await associatePostRelations(
        updatedPost.id,
        validatedPost.categories || [],
        validatedPost.tags || []
      );

      const categories = await fetchCategoriesByPostId(postId);
      const tags = await fetchTagsByPostId(postId);

      const sendPost: Post = mapPostToDto(
        updatedPost,
        foundPost.author,
        categories,
        tags
      );

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

      const foundPost = await fetchPostIfExists(postId, res);
      if (!foundPost) {
        return;
      }

      const deletedPost = await prisma.posts.delete({
        where: { id: postId },
      });

      sendDeleted(res, deletedPost, 'Post deleted successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to delete post', 500, [errorMessage]);
    }
  }
}

export default PostController;
