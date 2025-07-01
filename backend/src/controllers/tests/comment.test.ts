import express from 'express';
import request from 'supertest';
import CommentController from '../comment';
import { Routes } from '../../utils/enums';

const app = express();
app.use(express.json());

const commentController = new CommentController();

app.get(`${Routes.POSTS}/:postId/${Routes.COMMENTS}`, (req, res) =>
  commentController.getComments(req, res)
);
app.post(`${Routes.POSTS}/:postId/${Routes.COMMENTS}`, (req, res) =>
  commentController.postComment(req, res)
);
app.put(`${Routes.POSTS}/:postId/${Routes.COMMENTS}/:commentId`, (req, res) =>
  commentController.putComment(req, res)
);
app.delete(
  `${Routes.POSTS}/:postId/${Routes.COMMENTS}/:commentId`,
  (req, res) => commentController.deleteComment(req, res)
);

describe('CommentController', () => {
  it('should return all comments for a post', async () => {
    const res = await request(app).get(`${Routes.POSTS}/1/${Routes.COMMENTS}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].content).toBe('Great post!');
  });

  it('should create a new comment', async () => {
    const newComment = {
      id: 4,
      content: 'Great article!',
      authorId: 1,
    };
    const res = await request(app)
      .post(`${Routes.POSTS}/1/${Routes.COMMENTS}`)
      .send(newComment);
    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Great article!');
    expect(res.body.postId).toBe(1);
  });

  it('should return 400 for invalid comment creation', async () => {
    const res = await request(app)
      .post(`${Routes.POSTS}/1/${Routes.COMMENTS}`)
      .send({ content: 'Missing authorId' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Content, postId, and authorId are required.');
  });

  it('should update an existing comment', async () => {
    const updatedComment = {
      id: 1,
      content: 'Updated comment',
      postId: 1,
      authorId: 2,
    };
    const res = await request(app)
      .put(`${Routes.POSTS}/1/${Routes.COMMENTS}/1`)
      .send(updatedComment);
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Updated comment');
  });

  it('should return 404 for updating a non-existing comment', async () => {
    const updatedComment = {
      id: 99,
      content: 'Ghost comment',
      postId: 1,
      authorId: 2,
    };
    const res = await request(app)
      .put(`${Routes.POSTS}/1/${Routes.COMMENTS}/99`)
      .send(updatedComment);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Comment not found.');
  });

  it('should delete an existing comment', async () => {
    const res = await request(app).delete(
      `${Routes.POSTS}/1/${Routes.COMMENTS}/1`
    );
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Post deleted successfully.');
  });

  it('should return 404 for deleting a non-existing comment', async () => {
    const res = await request(app).delete(
      `${Routes.POSTS}/1/${Routes.COMMENTS}/99`
    );
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Comment not found.');
  });
});
