import { Response } from 'express';
import { users } from '../utils/mockData';
import { User, UserUpdate } from '../utils/interfaces';
import { ValidatedRequest } from '../middleware/validation';

class UserController {
  getUsers(req: ValidatedRequest, res: Response): void {
    const data = users;
    res.status(200).json(data);
  }

  postUser(req: ValidatedRequest<User>, res: Response): void {
    const validatedUser: User = req.validatedBody!;

    if (users.some(user => user.id === validatedUser.id)) {
      res.status(400).json({ error: 'User with this ID already exists.' });
      return;
    }

    users.push(validatedUser);
    res.status(201).json(validatedUser);
  }

  putUser(
    req: ValidatedRequest<UserUpdate, unknown, { userId: number }>,
    res: Response
  ): void {
    const userId = req.validatedParams!.userId;
    const updatedUser: UserUpdate = req.validatedBody!;

    const foundElemIdx = users.findIndex(user => user.id === userId);

    if (foundElemIdx === -1) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    users[foundElemIdx] = { id: userId, ...updatedUser };
    res.status(200).json(users[foundElemIdx]);
  }

  deleteUser(
    req: ValidatedRequest<unknown, unknown, { userId: number }>,
    res: Response
  ): void {
    const userId = req.validatedParams!.userId;

    const foundElemIdx = users.findIndex(user => user.id === userId);

    if (foundElemIdx === -1) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    users.splice(foundElemIdx, 1);
    res.status(200).json({ message: 'User deleted successfully.' });
  }
}

export default UserController;
