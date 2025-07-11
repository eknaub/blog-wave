export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  users: {
    id: number;
    username: string;
    email: string;
  };
}

export interface CommentCreate {
  content: string;
  postId: number;
  authorId: number;
}
