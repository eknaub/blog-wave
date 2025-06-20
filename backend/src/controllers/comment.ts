import { Request, Response } from "express";
import { comments } from "../utils/mockData";
import { Comment } from "../utils/interfaces";

class CommentController {
  getComments(
    req: Request<{ postId: string }, {}, Comment>,
    res: Response
  ): void {
    const postId = Number(req.params.postId);

    if (!postId) {
      res.status(400).json({ error: "Post ID is required." });
      return;
    }

    let data = comments;
    if (postId) {
      data = comments.filter((comment) => comment.postId === postId);
    }

    res.status(200).json(data);
  }

  postComment(
    req: Request<{ postId: string }, {}, Comment>,
    res: Response
  ): void {
    const postId = Number(req.params.postId);
    const newComment: Comment = { ...req.body, postId };

    if (comments.some((comment) => comment.id === newComment.id)) {
      res.status(400).json({ error: "Comment with this ID already exists." });
      return;
    }

    if (!newComment.content || !newComment.postId || !newComment.authorId) {
      res
        .status(400)
        .json({ error: "Content, postId, and authorId are required." });
      return;
    }

    comments.push(newComment);

    res.status(201).json(newComment);
  }

  putComment(
    req: Request<{ postId: string; commentId: string }, {}, Comment>,
    res: Response
  ): void {
    const postId = Number(req.params.postId);
    const commentId = Number(req.params.commentId);
    const updatedComment: Comment = req.body;
    const foundElemIdx = comments.findIndex(
      (comment) => comment.id === commentId
    );

    if (foundElemIdx === -1) {
      res.status(404).json({ error: "Comment not found." });
      return;
    }

    if (!updatedComment.content || !updatedComment.authorId) {
      res
        .status(400)
        .json({ error: "Content and authorId are required for update." });
      return;
    }

    comments[foundElemIdx] = updatedComment;

    res.status(200).json(comments[foundElemIdx]);
  }

  deleteComment(
    req: Request<{ postId: string; commentId: string }, {}, Comment>,
    res: Response
  ): void {
    const postId = Number(req.params.postId);
    const commentId = Number(req.params.commentId);
    const foundElemIdx = comments.findIndex(
      (comment) => comment.id === commentId
    );

    if (foundElemIdx === -1) {
      res.status(404).json({ error: "Comment not found." });
      return;
    }

    comments.filter((comment) => comment.id !== commentId);
    res.status(200).json({ message: "Post deleted successfully." });
  }
}

export default CommentController;
