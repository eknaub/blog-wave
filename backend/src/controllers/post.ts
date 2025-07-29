import { Response } from 'express';
import { Post, PostCreate, PostUpdate, PostVote } from '../api/models/post';
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
  fetchVotesByPostId,
  mapPostToDto,
} from './helpers/post';
import { fetchCategoriesByPostId } from './helpers/category';
import { fetchTagsByPostId } from './helpers/tag';
import { VoteType } from '@prisma/client';

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
          const votes = await fetchVotesByPostId(post.id);
          return mapPostToDto(post, post.author, categories, tags, votes);
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

      const initialVotes: PostVote[] = [];

      const sendPost: Post = mapPostToDto(
        createdPost,
        foundUser,
        createdCategories,
        createdTags,
        initialVotes
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
      const votes = await fetchVotesByPostId(postId);

      const sendPost: Post = mapPostToDto(
        updatedPost,
        foundPost.author,
        categories,
        tags,
        votes
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

  async votePost(
    req: ValidatedRequest<PostVote, unknown, { postId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const postId = req.validatedParams!.postId;
      const authUser = req.user as
        | { id: number; username: string; email: string }
        | undefined;
      const validatedVote: PostVote = req.validatedBody!;

      const foundPost = await fetchPostIfExists(postId, res);
      if (!foundPost) {
        return;
      }

      const foundUser = await fetchUserIfExists(authUser?.id, res);
      if (!foundUser) {
        return;
      }

      const existingVote = await prisma.postVotes.findFirst({
        where: {
          postId: postId,
          userId: foundUser.id,
        },
      });

      if (existingVote && existingVote.value === validatedVote.value) {
        sendError(res, 'You have already voted this way', 400);
        return;
      }

      if (existingVote) {
        await prisma.postVotes.update({
          where: { id: existingVote.id },
          data: { value: validatedVote.value },
        });
      } else {
        await prisma.postVotes.create({
          data: {
            postId: postId,
            userId: foundUser.id,
            value: validatedVote.value,
          },
        });
      }

      if (validatedVote.value === 'LIKE') {
        await prisma.posts.update({
          where: { id: postId },
          data: { votesCount: { increment: 1 } },
        });
      } else {
        await prisma.posts.update({
          where: { id: postId },
          data: { votesCount: { decrement: 1 } },
        });
      }

      const categories = await fetchCategoriesByPostId(foundPost.id);
      const tags = await fetchTagsByPostId(foundPost.id);
      const votes = await fetchVotesByPostId(foundPost.id);
      const mappedPost = mapPostToDto(
        foundPost,
        foundPost.author,
        categories,
        tags,
        votes
      );

      sendSuccess(res, mappedPost, 'Post upvoted successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to vote on post', 500, [errorMessage]);
    }
  }

  async getPostVotes(
    req: ValidatedRequest<unknown, { type: VoteType }, { postId: number }>,
    res: Response
  ): Promise<void> {
    try {
      const postId = req.validatedParams!.postId;
      const type = req.validatedQuery!.type;

      const foundPost = await fetchPostIfExists(postId, res);
      if (!foundPost) {
        return;
      }

      const votes = await prisma.postVotes.findMany({
        where: { postId: postId, value: type },
      });

      sendSuccess(res, votes, 'Post votes retrieved successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      sendError(res, 'Failed to retrieve post votes', 500, [errorMessage]);
    }
  }
}

export default PostController;
