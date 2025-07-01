import { Response } from 'express';
import { posts } from '../utils/mockData';
import { Post, PostUpdate } from '../utils/interfaces';
import { ValidatedRequest } from '../middleware/validation';

class PostController {
  getPosts(
    req: ValidatedRequest<unknown, { userId: number | undefined }>,
    res: Response
  ): void {
    const userId = req.validatedQuery!.userId;
    let data = posts;

    if (userId) {
      data = posts.filter(post => post.authorId === userId);
    }

    res.status(200).json(data);
  }

  postPost(req: ValidatedRequest<Post>, res: Response): void {
    const newPost: Post = req.validatedBody!;

    if (posts.some(post => post.id === newPost.id)) {
      res.status(400).json({ error: 'Post with this ID already exists.' });
      return;
    }

    posts.push(newPost);
    res.status(201).json(newPost);
  }

  putPost(
    req: ValidatedRequest<Post, unknown, { postId: number }>,
    res: Response
  ): void {
    const postId = req.validatedParams!.postId;
    const updatedPost: PostUpdate = req.validatedBody!;
    const foundElemIdx = posts.findIndex(post => post.id === postId);

    if (foundElemIdx === -1) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }

    posts[foundElemIdx] = { id: postId, ...updatedPost };

    res.status(200).json(posts[foundElemIdx]);
  }

  deletePost(
    req: ValidatedRequest<Post, unknown, { postId: number }>,
    res: Response
  ): void {
    const postId = req.validatedParams!.postId;

    if (isNaN(postId) || postId <= 0) {
      res
        .status(400)
        .json({ error: 'Invalid post ID. Must be a positive number.' });
      return;
    }

    const foundElemIdx = posts.findIndex(post => post.id === postId);

    if (foundElemIdx === -1) {
      res.status(404).json({ error: 'Post not found.' });
      return;
    }

    posts.splice(foundElemIdx, 1);
    res.status(200).json({ message: 'Post deleted successfully.' });
  }
}

export default PostController;
