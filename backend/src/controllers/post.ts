import { Response } from 'express';
import { Post, PostUpdate } from '../utils/interfaces';
import { ValidatedRequest } from '../middleware/validation';
import prisma from '../prisma/client';

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

      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async postPost(req: ValidatedRequest<Post>, res: Response): Promise<void> {
    try {
      const validatedPost: Post = req.validatedBody!;
      const foundPost = await prisma.posts.findFirst({
        where: { id: validatedPost.id },
      });

      if (foundPost) {
        res.status(400).json({ error: 'Post with this ID already exists.' });
        return;
      }

      const foundAuthor = await prisma.users.findFirst({
        where: { id: validatedPost.authorId },
      });

      if (!foundAuthor) {
        res.status(404).json({ error: 'Author not found.' });
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

      res.status(201).json(createdPost);
    } catch (error) {
      res.status(500).json({ error });
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
        res.status(404).json({ error: 'Post not found.' });
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

      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async deletePost(
    req: ValidatedRequest<Post, unknown, { postId: number }>,
    res: Response
  ): Promise<void> {
    const postId = req.validatedParams!.postId;
    const foundPost = await prisma.posts.findFirst({
      where: { id: postId },
    });

    if (!foundPost) {
      res.status(404).json({ error: 'Post not found.' });
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

    res.status(200).json(deletedPost);
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
        res.status(404).json({ error: 'Post not found.' });
        return;
      }

      const updatedPost = await prisma.posts.update({
        where: { id: postId },
        data: {
          published,
          updated_at: new Date(),
        },
      });

      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default PostController;
