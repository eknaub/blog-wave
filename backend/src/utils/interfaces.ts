export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
}
