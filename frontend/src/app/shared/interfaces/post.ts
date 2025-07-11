export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  users: {
    id: number;
    username: string;
    email: string;
  };
}

export interface PostCreate {
  title: string;
  content: string;
  authorId: number;
}
