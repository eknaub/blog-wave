import express from 'express';
import request from 'supertest';
import PostController from '../post';
import { Routes } from '../../utils/enums';

const app = express();
app.use(express.json());

const postController = new PostController();

app.get(Routes.POSTS, (req, res) => postController.getPosts(req, res));
app.post(Routes.POSTS, (req, res) => postController.postPost(req, res));
app.put(`${Routes.POSTS}/:postId`, (req, res) =>
  postController.putPost(req, res)
);
app.delete(`${Routes.POSTS}/:postId`, (req, res) =>
  postController.deletePost(req, res)
);

describe('PostController', () => {
  it('should return all posts', async () => {
    const res = await request(app).get(Routes.POSTS);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new post', async () => {
    const newPost = {
      id: 99,
      title: 'Test Post',
      content: 'Test Content',
      authorId: 1,
    };
    const res = await request(app).post(Routes.POSTS).send(newPost);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Post');
  });

  it('should return 400 for invalid post creation', async () => {
    const res = await request(app)
      .post(Routes.POSTS)
      .send({ title: 'Invalid Post' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Title, content, and authorId are required.');
  });

  it('should update an existing post', async () => {
    const updatedPost = {
      title: 'Updated Post',
      content: 'Updated Content',
      authorId: 1,
    };
    const res = await request(app).put(`${Routes.POSTS}/1`).send(updatedPost);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Post');
  });

  it('should return 404 for updating a non-existing post', async () => {
    const res = await request(app).put(`${Routes.POSTS}/999`).send({
      title: 'Non-existing Post',
      content: 'Content',
      authorId: 1,
    });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Post not found.');
  });

  it('should delete an existing post', async () => {
    const res = await request(app).delete(`${Routes.POSTS}/99`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Post deleted successfully.');
  });

  it('should return 404 for deleting a non-existing post', async () => {
    const res = await request(app).delete(`${Routes.POSTS}/999`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Post not found.');
  });
});
