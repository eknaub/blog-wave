import { Request, Response } from "express";

class UserController {
  getUser(req: Request, res: Response): void {
    res.json("Get");
  }
  postUser(req: Request, res: Response): void {
    res.json("Post");
  }
  putUser(req: Request, res: Response): void {
    res.json("Put");
  }
  deleteUser(req: Request, res: Response): void {
    res.json("Delete");
  }
}

export default UserController;
