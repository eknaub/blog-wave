export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}
