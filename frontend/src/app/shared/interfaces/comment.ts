export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}
