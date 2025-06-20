import { Request, Response } from "express";
import { users } from "../utils/mockData";
import { User } from "../utils/interfaces";

class UserController {
  getUsers(req: Request, res: Response): void {
    const data = users;

    res.status(200).json(data);
  }

  postUser(req: Request<{}, {}, User>, res: Response): void {
    const newUser: User = req.body;

    if (users.some((user) => user.id === newUser.id)) {
      res.status(400).json({ error: "User with this ID already exists." });
      return;
    }

    if (!newUser.username || !newUser.email) {
      res.status(400).json({ error: "Username and email are required." });
      return;
    }

    users.push(newUser);

    res.status(201).json(newUser);
  }

  putUser(req: Request<{ userId: string }, {}, User>, res: Response): void {
    const userId = Number(req.params.userId);
    const updatedUser: User = req.body;
    const foundElemIdx = users.findIndex((user) => user.id === userId);

    if (foundElemIdx === -1) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    if (!updatedUser.username || !updatedUser.email) {
      res.status(400).json({ error: "Username and email are required." });
      return;
    }

    users[foundElemIdx] = updatedUser;

    res.status(200).json(users[foundElemIdx]);
  }

  deleteUser(req: Request<{ userId: string }, {}, User>, res: Response): void {
    const userId = Number(req.params.userId);
    const foundElemIdx = users.findIndex((user) => user.id === userId);

    if (foundElemIdx === -1) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    users.filter((user) => user.id !== userId);
    res.status(200).json({ message: "User deleted successfully." });
  }
}

export default UserController;
