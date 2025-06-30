import { Request, Response } from "express";
import { posts } from "../utils/mockData";
import { Post } from "../utils/interfaces";

class PostController {
  getPosts(req: Request, res: Response): void {
    const { userId } = req.query;

    let data = posts;
    if (userId) {
      data = posts.filter((post) => post.authorId === Number(userId));
    }

    res.status(200).json(data);
  }

  postPost(req: Request<{}, {}, Post>, res: Response): void {
    const newPost: Post = req.body;

    if (posts.some((post) => post.id === newPost.id)) {
      res.status(400).json({ error: "Post with this ID already exists." });
      return;
    }

    if (!newPost.title || !newPost.content || !newPost.authorId) {
      res
        .status(400)
        .json({ error: "Title, content, and authorId are required." });
      return;
    }

    posts.push(newPost);
    res.status(201).json(newPost);
  }

  putPost(req: Request<{ postId: string }, {}, Post>, res: Response): void {
    const postId = Number(req.params.postId);
    const updatedPost: Post = req.body;
    const foundElemIdx = posts.findIndex((post) => post.id === postId);

    if (foundElemIdx === -1) {
      res.status(404).json({ error: "Post not found." });
      return;
    }

    if (!updatedPost.title || !updatedPost.content || !updatedPost.authorId) {
      res
        .status(400)
        .json({ error: "Title, content, and authorId are required." });
      return;
    }

    posts[foundElemIdx] = updatedPost;

    res.status(200).json(posts[foundElemIdx]);
  }

  deletePost(req: Request<{ postId: string }, {}, Post>, res: Response): void {
    const postId = Number(req.params.postId);
    const foundElemIdx = posts.findIndex((post) => post.id === postId);

    if (foundElemIdx === -1) {
      res.status(404).json({ error: "Post not found." });
      return;
    }

    posts.slice(foundElemIdx, 1);
    res.status(200).json({ message: "Post deleted successfully." });
  }
}

export default PostController;
