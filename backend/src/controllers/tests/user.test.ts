import express from 'express';
import request from 'supertest';
import UserController from '../user';
import { User } from '../../api/interfaces';
import { Routes } from '../../utils/enums';

const app = express();
app.use(express.json());

const userController = new UserController();

app.get(Routes.USERS, (req, res) => userController.getUsers(req, res));
app.post(Routes.USERS, (req, res) => userController.postUser(req, res));
app.put(`${Routes.USERS}/:userId`, (req, res) =>
  userController.putUser(req, res)
);
app.delete(`${Routes.USERS}/:userId`, (req, res) =>
  userController.deleteUser(req, res)
);

describe('UserController', () => {
  it('should return all users', async () => {
    const res = await request(app).get(Routes.USERS);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new user', async () => {
    const newUser: User = {
      id: 99,
      username: 'bob',
      email: 'bob@example.com',
    };
    const res = await request(app).post(Routes.USERS).send(newUser);
    expect(res.status).toBe(201);
    expect(res.body.username).toBe('bob');
  });

  it('should return 400 for invalid user creation', async () => {
    const res = await request(app)
      .post(Routes.USERS)
      .send({ username: 'noemail' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Username and email are required.');
  });

  it('should update an existing user', async () => {
    const updatedUser = {
      username: 'alice_updated',
      email: 'alice_updated@example.com',
    };
    const res = await request(app).put(`${Routes.USERS}/1`).send(updatedUser);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('alice_updated');
  });

  it('should return 404 for updating a non-existing user', async () => {
    const res = await request(app).put(`${Routes.USERS}/999`).send({
      username: 'ghost',
      email: 'ghost@example.com',
    });
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found.');
  });

  it('should delete an existing user', async () => {
    const res = await request(app).delete(`${Routes.USERS}/99`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User deleted successfully.');
  });

  it('should return 404 for deleting a non-existing user', async () => {
    const res = await request(app).delete(`${Routes.USERS}/999`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found.');
  });
});
