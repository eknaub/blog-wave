import { Comment, Post, User } from '../api/interfaces';

export const users: User[] = [
  {
    id: 1,
    username: 'alice',
    email: 'alice@example.com',
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
    password: 'password',
  },
  {
    id: 2,
    username: 'bob',
    email: 'bob@example.com',
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
    password: 'password',
  },
  {
    id: 3,
    username: 'charlie',
    email: 'charlie@example.com',
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
    password: 'password',
  },
  {
    id: 4,
    username: 'diana',
    email: 'diana@example.com',
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
    password: 'password',
  },
  {
    id: 5,
    username: 'eve',
    email: 'eve@example.com',
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
    password: 'password',
  },
  {
    id: 6,
    username: 'frank',
    email: 'frank@example.com',
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
    password: 'password',
  },
  {
    id: 7,
    username: 'grace',
    email: 'grace@example.com',
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
    password: 'password',
  },
  {
    id: 8,
    username: 'henry',
    email: 'henry@example.com',
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
    password: 'password',
  },
];

export const posts: Post[] = [
  {
    id: 1,
    title: 'Getting Started with Angular',
    content:
      "Angular is a powerful framework for building web applications. In this post, we'll explore the basics of Angular development and how to get started with your first project.",
    authorId: 1,
    published: true,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 2,
    title: 'TypeScript Best Practices',
    content:
      'TypeScript brings type safety to JavaScript. Here are some best practices for writing clean and maintainable TypeScript code in your projects.',
    authorId: 2,
    published: true,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 3,
    title: 'Building Responsive Web Apps',
    content:
      "Creating responsive web applications is crucial in today's mobile-first world. Learn how to use CSS Grid and Flexbox to build adaptive layouts.",
    authorId: 1,
    published: true,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 4,
    title: 'State Management in Angular',
    content:
      'Managing application state can be challenging. This post covers different approaches to state management in Angular applications, including services and RxJS.',
    authorId: 3,
    published: true,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 5,
    title: 'REST API Design Principles',
    content:
      'Well-designed APIs are the backbone of modern web applications. Learn the key principles for designing RESTful APIs that are intuitive and maintainable.',
    authorId: 2,
    published: true,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 6,
    title: 'CSS Grid vs Flexbox',
    content:
      'Both CSS Grid and Flexbox are powerful layout tools. Understanding when to use each one will help you create better layouts more efficiently.',
    authorId: 4,
    published: true,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 7,
    title: 'JavaScript ES6+ Features',
    content:
      'Modern JavaScript includes many powerful features. This post covers arrow functions, destructuring, modules, and other ES6+ features that improve your code.',
    authorId: 3,
    published: true,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
  {
    id: 8,
    title: 'Testing Angular Components',
    content:
      'Testing is essential for maintainable applications. Learn how to write effective unit tests for your Angular components using Jasmine and Karma.',
    authorId: 1,
    published: true,
    createdAt: new Date('2023-01-01T10:00:00Z'),
    updatedAt: new Date('2023-01-01T10:00:00Z'),
  },
];

export const comments: Comment[] = [
  {
    id: 1,
    content: 'Great introduction to Angular! Very helpful for beginners.',
    postId: 1,
    authorId: 2,
    createdAt: new Date('2023-01-02T10:00:00Z'),
    updatedAt: new Date('2023-01-02T10:00:00Z'),
  },
  {
    id: 2,
    content:
      'Thanks for sharing these TypeScript tips. The type safety examples were particularly useful.',
    postId: 2,
    authorId: 3,
    createdAt: new Date('2023-01-02T10:00:00Z'),
    updatedAt: new Date('2023-01-02T10:00:00Z'),
  },
  {
    id: 3,
    content:
      "I've been struggling with responsive design. This post clarified a lot of concepts for me.",
    postId: 3,
    authorId: 4,
    createdAt: new Date('2023-01-02T10:00:00Z'),
    updatedAt: new Date('2023-01-02T10:00:00Z'),
  },
  {
    id: 4,
    content: 'Could you elaborate more on the RxJS patterns mentioned?',
    postId: 4,
    authorId: 1,
    createdAt: new Date('2023-01-02T10:00:00Z'),
    updatedAt: new Date('2023-01-02T10:00:00Z'),
  },
  {
    id: 5,
    content:
      "Excellent API design principles. I'll definitely apply these in my next project.",
    postId: 5,
    authorId: 1,
    createdAt: new Date('2023-01-02T10:00:00Z'),
    updatedAt: new Date('2023-01-02T10:00:00Z'),
  },
  {
    id: 6,
    content:
      'The comparison between Grid and Flexbox was spot on. Bookmarked for future reference!',
    postId: 6,
    authorId: 2,
    createdAt: new Date('2023-01-02T10:00:00Z'),
    updatedAt: new Date('2023-01-02T10:00:00Z'),
  },
  {
    id: 7,
    content:
      'ES6+ has really transformed JavaScript development. Love the destructuring examples.',
    postId: 7,
    authorId: 4,
    createdAt: new Date('2023-01-02T10:00:00Z'),
    updatedAt: new Date('2023-01-02T10:00:00Z'),
  },
  {
    id: 8,
    content:
      'Testing has always been intimidating, but this makes it more approachable.',
    postId: 8,
    authorId: 3,
    createdAt: new Date('2023-01-02T10:00:00Z'),
    updatedAt: new Date('2023-01-02T10:00:00Z'),
  },
  {
    id: 9,
    content: 'Are there any plans for a follow-up post on integration testing?',
    postId: 8,
    authorId: 2,
    createdAt: new Date('2023-01-02T10:00:00Z'),
    updatedAt: new Date('2023-01-02T10:00:00Z'),
  },
  {
    id: 10,
    content:
      'This helped me understand when to use Grid vs Flexbox. Thank you!',
    postId: 6,
    authorId: 1,
    createdAt: new Date('2023-01-02T10:00:00Z'),
    updatedAt: new Date('2023-01-02T10:00:00Z'),
  },
  {
    id: 11,
    content:
      'The Angular CLI examples were very practical. Keep up the great work!',
    postId: 1,
    authorId: 4,
    createdAt: new Date('2023-01-02T10:00:00Z'),
    updatedAt: new Date('2023-01-02T10:00:00Z'),
  },
  {
    id: 12,
    content:
      "I'd love to see more advanced TypeScript patterns in a future post.",
    postId: 2,
    authorId: 1,
    createdAt: new Date('2023-01-02T10:00:00Z'),
    updatedAt: new Date('2023-01-02T10:00:00Z'),
  },
];
