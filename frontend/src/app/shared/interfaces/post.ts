export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostCreate {
  title: string;
  content: string;
  authorId: number;
}
