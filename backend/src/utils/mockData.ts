import { Comment, Post, User } from "./interfaces";

export let users: User[] = [
  { id: 1, username: "alice", email: "alice@example.com" },
  { id: 2, username: "bob", email: "bob@example.com" },
  { id: 3, username: "charlie", email: "charlie@example.com" },
];

export let posts: Post[] = [
  { id: 1, title: "First Post", content: "Hello world!", authorId: 1 },
  { id: 2, title: "Second Post", content: "Another post here.", authorId: 2 },
  { id: 3, title: "Third Post", content: "Yet another post.", authorId: 1 },
];

export let comments: Comment[] = [
  { id: 1, content: "Great post!", postId: 1, authorId: 2 },
  { id: 2, content: "Thanks for sharing.", postId: 1, authorId: 3 },
  { id: 3, content: "Interesting read.", postId: 2, authorId: 1 },
];
