import prisma from '../../prisma/client';
import { Response } from 'express';
import { sendNotFound } from '../../utils/response';
import { Post, PostVote } from '../../api/models/post';
import { fetchUserIfExists } from './user';
import { User, UserDetail } from '../../api/models/user';
import { Category, CategoryDetails } from '../../api/models/category';
import { Tag, TagDetails } from '../../api/models/tag';
import { fetchCategoriesByPostId, mapCategoryToDetailDto } from './category';
import { fetchTagsByPostId, mapTagToDetailsDto } from './tag';

export interface PrismaReturnedPost {
  id: number;
  title: string;
  content: string;
  published: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  authorId: number;
}

export function mapPostToDto(
  post: PrismaReturnedPost | Post,
  author: User | UserDetail,
  categories: Category[],
  tags: Tag[],
  votes: PostVote[]
): Post {
  const mappedCategoryDetails: CategoryDetails[] = categories.map(cat =>
    mapCategoryToDetailDto(cat)
  );
  const mappedTags: TagDetails[] = tags.map(tag => mapTagToDetailsDto(tag));

  if (mappedCategoryDetails.length === 0 || mappedTags.length === 0) {
    throw new Error('Post must have at least one category and one tag.');
  }

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
    categories: mappedCategoryDetails as [
      CategoryDetails,
      ...CategoryDetails[],
    ],
    tags: mappedTags as [TagDetails, ...TagDetails[]],
    votesCount: getTotalVotes(votes),
  };
}

const getTotalVotes = (votes: PostVote[]): number => {
  return votes.reduce((total, vote) => {
    return total + (vote.value === 'LIKE' ? 1 : -1);
  }, 0);
};

export async function fetchPostIfExists(
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

  const foundUser = await fetchUserIfExists(foundPost.authorId, res);
  if (!foundUser) {
    // getUserOrNotFound already sends a response, just return
    return null;
  }

  // Fetch necessary data associated with the post
  const categories = await fetchCategoriesByPostId(postId);
  const tags = await fetchTagsByPostId(postId);
  const votes = await fetchVotesByPostId(postId);

  // Return the found post with the user information
  const post = mapPostToDto(foundPost, foundUser, categories, tags, votes);

  return post;
}

export async function associatePostRelations(
  postId: number,
  categoryIds: number[],
  tagIds: number[]
): Promise<{
  createdCategories: Category[];
  createdTags: Tag[];
}> {
  await prisma.postCategory.createMany({
    data: categoryIds.map(categoryId => ({
      postId,
      categoryId,
    })),
  });

  await prisma.postTags.createMany({
    data: tagIds.map(tagId => ({
      postId,
      tagId,
    })),
  });

  const tags = await fetchTagsByPostId(postId);
  const categories = await fetchCategoriesByPostId(postId);
  return { createdCategories: categories, createdTags: tags };
}

export async function fetchVotesByPostId(postId: number): Promise<PostVote[]> {
  const fetchedVotes = await prisma.postVotes.findMany({
    where: { postId },
  });

  return fetchedVotes;
}

export function mapVotesToDto(votes: PostVote[]): PostVote[] {
  return votes.map(vote => ({
    id: vote.id,
    postId: vote.postId,
    userId: vote.userId,
    value: vote.value,
    createdAt: vote.createdAt,
    updatedAt: vote.updatedAt,
  }));
}
