import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogPostComment } from './blog-post-comment';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import {
  Comment,
  CommentCreate,
} from '../../../../../shared/interfaces/comment';

describe('BlogPostComment', () => {
  let component: BlogPostComment;
  let fixture: ComponentFixture<BlogPostComment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPostComment],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPostComment);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('postId', 1);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('comments', () => {
    it('should return comments for the post', () => {
      const mockComments: Comment[] = [
        {
          id: 1,
          postId: 1,
          authorId: 1,
          content: 'This is a test comment',
          createdAt: new Date(),
          updatedAt: new Date(),
          users: {
            id: 1,
            username: 'testuser',
            email: 'user@example.com',
          },
        },
      ];
      spyOn(component.blogService, 'getCommentsByPostId').and.returnValue(
        signal(mockComments)
      );

      expect(component.comments()).toEqual(mockComments);
      expect(component.blogService.getCommentsByPostId).toHaveBeenCalledWith(1);
    });
  });

  describe('submitComment', () => {
    it('should not submit comment if form is invalid', () => {
      spyOn(component.logger, 'error');
      spyOn(component.blogService, 'uploadCommentToPost');
      component.commentForm.setValue({ comment: '' });
      component.submitComment();
      expect(component.logger.error).toHaveBeenCalledWith(
        'Comment form is invalid'
      );
      expect(component.blogService.uploadCommentToPost).not.toHaveBeenCalled();
    });

    it('should submit a comment', () => {
      const mockComment: CommentCreate = {
        postId: 1,
        authorId: 1,
        content: 'This is a test comment',
      };

      spyOn(component.blogService, 'uploadCommentToPost').and.returnValue(
        of(mockComment)
      );

      component.commentForm.patchValue({ comment: 'This is a test comment' });
      component.submitComment();

      expect(component.blogService.uploadCommentToPost).toHaveBeenCalledWith(
        1,
        'This is a test comment'
      );
    });

    it('should handle comment submission error', () => {
      spyOn(component.logger, 'error');
      spyOn(component.blogService, 'uploadCommentToPost').and.returnValue(
        throwError(() => new Error('Failed to submit comment'))
      );

      component.commentForm.patchValue({ comment: 'This is a test comment' });
      component.submitComment();

      expect(component.logger.error).toHaveBeenCalledWith(
        'Failed to upload comment: Error: Failed to submit comment'
      );
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', () => {
      const mockComment: Comment = {
        id: 1,
        postId: 1,
        authorId: 1,
        content: 'This is a test comment',
        createdAt: new Date(),
        updatedAt: new Date(),
        users: {
          id: 1,
          username: 'testuser',
          email: 'user@example.com',
        },
      };
      spyOn(component.blogService, 'deleteComment').and.returnValue(
        of(mockComment)
      );
      spyOn(component.logger, 'log');

      component.deleteComment(1);

      expect(component.blogService.deleteComment).toHaveBeenCalledWith(1, 1);
      expect(component.logger.log).toHaveBeenCalledWith(
        'Comment with ID 1 deleted successfully'
      );
    });

    it('should handle comment deletion error', () => {
      spyOn(component.logger, 'error');
      spyOn(component.blogService, 'deleteComment').and.returnValue(
        throwError(() => new Error('Failed to delete comment'))
      );

      component.deleteComment(1);

      expect(component.logger.error).toHaveBeenCalledWith(
        'Failed to delete comment with ID 1: Error: Failed to delete comment'
      );
    });
  });
});
