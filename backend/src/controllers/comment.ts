import { Response } from 'express';
import { comments } from '../utils/mockData';
import { Comment, CommentUpdate } from '../utils/interfaces';
import { ValidatedRequest } from '../middleware/validation';

class CommentController {
  getComments(
    req: ValidatedRequest<Comment, unknown, { postId: number }>,
    res: Response
  ): void {
    const postId = req.validatedParams!.postId;

    let data = comments;
    if (postId) {
      data = comments.filter(comment => comment.postId === postId);
    }

    res.status(200).json(data);
  }

  postComment(
    req: ValidatedRequest<Comment, unknown, { postId: number }>,
    res: Response
  ): void {
    const postId = req.validatedParams!.postId;
    const newComment: Comment = { ...req.validatedBody!, postId };

    if (comments.some(comment => comment.id === newComment.id)) {
      res.status(400).json({ error: 'Comment with this ID already exists.' });
      return;
    }

    comments.push(newComment);

    res.status(201).json(newComment);
  }

  putComment(
    req: ValidatedRequest<
      Comment,
      unknown,
      { postId: number; commentId: number }
    >,
    res: Response
  ): void {
    const postId = req.validatedParams!.postId;
    const commentId = req.validatedParams!.commentId;

    const updatedComment: CommentUpdate = req.validatedBody!;
    const foundElemIdx = comments.findIndex(
      comment => comment.id === commentId && comment.postId === postId
    );

    if (foundElemIdx === -1) {
      res.status(404).json({ error: 'Comment not found.' });
      return;
    }

    comments[foundElemIdx] = {
      id: commentId,
      ...updatedComment,
    };

    res.status(200).json(comments[foundElemIdx]);
  }

  deleteComment(
    req: ValidatedRequest<
      Comment,
      unknown,
      { postId: number; commentId: number }
    >,
    res: Response
  ): void {
    const postId = req.validatedParams!.postId;
    const commentId = req.validatedParams!.commentId;

    const foundElemIdx = comments.findIndex(
      comment => comment.id === commentId && comment.postId === postId
    );

    if (foundElemIdx === -1) {
      res.status(404).json({ error: 'Comment not found.' });
      return;
    }

    comments.splice(foundElemIdx, 1);
    res.status(200).json({ message: 'Comment deleted successfully.' });
  }
}

export default CommentController;
