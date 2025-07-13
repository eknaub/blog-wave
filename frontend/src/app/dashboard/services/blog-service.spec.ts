import { TestBed } from '@angular/core/testing';

import { BlogService } from './blog-service';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Post } from '../../shared/interfaces/post';
import { Comment } from '../../shared/interfaces/comment';
import { of, throwError } from 'rxjs';

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(BlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('posts', () => {
    it('should load posts', () => {
      const mockData: Post[] = [
        {
          id: 1,
          title: 'Test Post',
          content: 'This is a test post.',
          authorId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          published: true,
          users: {
            id: 1,
            username: 'John Doe',
            email: 'user@example.com',
          },
        },
      ];
      spyOn(service['baseHttp'], 'get').and.returnValue(of(mockData));

      service['loadPosts']();

      expect(service.posts().length).toBe(1);
      expect(service.postsError()).toBe(null);
    });

    it('should handle errors when loading posts', () => {
      const errorMessage = 'Failed to load posts';
      spyOn(service['baseHttp'], 'get').and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      service['loadPosts']();

      expect(service.posts().length).toBe(0);
      expect(service.postsError()).toBe(errorMessage);
    });

    it('should get post count by author id', () => {
      const mockPosts: Post[] = [
        {
          id: 1,
          title: 'Post by Author 1',
          content: 'Content',
          authorId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          published: true,
          users: {
            id: 1,
            username: 'Author 1',
            email: 'user@example.com',
          },
        },
        {
          id: 2,
          title: 'Post by Author 2',
          content: 'Content',
          authorId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          published: true,
          users: {
            id: 2,
            username: 'Author 2',
            email: 'user@example.com',
          },
        },
      ];
      service.posts.set(mockPosts);

      const count = service.getPostCountByAuthor(1);

      expect(count).toBe(1);
    });

    it('should upload a new post', () => {
      const mockPost: Post = {
        id: 1,
        title: 'New Post',
        content: 'Content of the new post',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        published: true,
        users: {
          id: 1,
          username: 'John Doe',
          email: 'user@example.com',
        },
      };

      service['currentUser'] = {
        id: 1,
        username: 'John Doe',
        email: 'user@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(service['baseHttp'], 'post').and.returnValue(of(mockPost));
      spyOn(service.notificationService, 'showNotification');

      service
        .uploadPost('New Post', 'Content of the new post')
        .subscribe((post) => {
          expect(post).toEqual(mockPost);
          expect(service.posts().length).toBe(1);
          expect(service.posts()[0]).toEqual(mockPost);
          expect(
            service.notificationService.showNotification
          ).toHaveBeenCalledWith('Post created successfully');
        });
    });

    it('should throw an error if user is not authenticated when uploading a post', () => {
      service['currentUser'] = null;

      expect(() =>
        service.uploadPost('New Post', 'Content of the new post')
      ).toThrowError('User not authenticated');
    });

    it('should delete a post', () => {
      const mockPost: Post = {
        id: 1,
        title: 'Post to be deleted',
        content: 'Content of the post',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        published: true,
        users: {
          id: 1,
          username: 'John Doe',
          email: 'user@example.com',
        },
      };
      service.posts.set([mockPost]);
      spyOn(service['baseHttp'], 'delete').and.returnValue(of(mockPost));
      spyOn(service.notificationService, 'showNotification');

      service.deletePost(mockPost.id).subscribe((post) => {
        expect(post).toEqual(mockPost);
        expect(service.posts().length).toBe(0);
        expect(
          service.notificationService.showNotification
        ).toHaveBeenCalledWith('Post deleted successfully');
      });
    });
  });

  describe('comments', () => {
    it('should load comments for a post', () => {
      const postId = 1;
      const mockComments: Comment[] = [
        {
          id: 1,
          content: 'Test comment',
          postId: postId,
          authorId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          users: {
            id: 1,
            username: 'Jane Doe',
            email: 'user@example.com',
          },
        },
      ];
      spyOn(service['baseHttp'], 'get').and.returnValue(of(mockComments));

      service.loadCommentsForPost(postId);
      expect(service.getCommentsByPostId(postId)()).toEqual(mockComments);
    });

    it('should handle errors when loading comments for a post', () => {
      const postId = 1;
      const errorMessage = 'Failed to load comments';
      spyOn(service.logger, 'error');
      spyOn(service['baseHttp'], 'get').and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      service.loadCommentsForPost(postId);
      expect(service.getCommentsByPostId(postId)().length).toBe(0);
      expect(service.logger.error).toHaveBeenCalledWith(
        `Failed to load comments for post ${postId}: ${errorMessage}`
      );
    });

    it('should upload a comment to a post if there are no comments', () => {
      const postId = 1;
      const mockComment: Comment = {
        id: 1,
        content: 'New comment',
        postId: postId,
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        users: {
          id: 1,
          username: 'Jane Doe',
          email: 'user@example.com',
        },
      };

      service['currentUser'] = {
        id: 1,
        username: 'John Doe',
        email: 'user@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (!service['commentsSignals'].has(postId)) {
        service['commentsSignals'].set(postId, signal<Comment[]>([]));
      }

      spyOn(service['baseHttp'], 'post').and.returnValue(of(mockComment));
      spyOn(service.notificationService, 'showNotification');

      service
        .uploadCommentToPost(postId, 'New comment')
        .subscribe((comment) => {
          expect(comment).toEqual(mockComment);
          expect(
            service.notificationService.showNotification
          ).toHaveBeenCalledWith('Comment added successfully');
          expect(service.getCommentsByPostId(postId)()).toContain(mockComment);
        });
    });

    it('should upload a comment to a post', () => {
      const postId = 1;
      const mockComment: Comment = {
        id: 1,
        content: 'New comment',
        postId: postId,
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        users: {
          id: 1,
          username: 'Jane Doe',
          email: 'user@example.com',
        },
      };

      service['currentUser'] = {
        id: 1,
        username: 'John Doe',
        email: 'user@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(service['baseHttp'], 'post').and.returnValue(of(mockComment));
      spyOn(service.notificationService, 'showNotification');

      service
        .uploadCommentToPost(postId, 'New comment')
        .subscribe((comment) => {
          expect(comment).toEqual(mockComment);
          expect(
            service.notificationService.showNotification
          ).toHaveBeenCalledWith('Comment added successfully');
          expect(service.getCommentsByPostId(postId)()).toContain(mockComment);
        });
    });

    it('should throw an error if user is not authenticated when uploading a comment', () => {
      service['currentUser'] = null;

      expect(() => service.uploadCommentToPost(1, 'New comment')).toThrowError(
        'User not authenticated'
      );
    });

    it('should delete a comment by id', () => {
      const postId = 1;
      const commentId = 1;
      const mockComment: Comment = {
        id: commentId,
        content: 'Comment to be deleted',
        postId: postId,
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        users: {
          id: 1,
          username: 'Jane Doe',
          email: 'user@example.com',
        },
      };
      service['commentsSignals'].set(postId, signal([mockComment]));
      spyOn(service['baseHttp'], 'delete').and.returnValue(of(mockComment));
      spyOn(service.notificationService, 'showNotification');

      service.deleteComment(postId, commentId).subscribe((comment) => {
        expect(comment).toEqual(mockComment);
        expect(service.getCommentsByPostId(postId)().length).toBe(0);
        expect(
          service.notificationService.showNotification
        ).toHaveBeenCalledWith('Comment deleted successfully');
      });
    });
  });
});
