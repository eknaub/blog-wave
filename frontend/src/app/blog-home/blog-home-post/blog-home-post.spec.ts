import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogPost } from './blog-home-post';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Post } from '../../../shared/api/models';

describe('BlogPost', () => {
  let component: BlogPost;
  let fixture: ComponentFixture<BlogPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPost],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogPost);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('post', {
      id: 1,
      title: 'Test Post',
      content: 'This is a test post.',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      published: true,
      users: {
        id: 1,
        username: 'Test Author',
        email: 'user@example.com',
      },
    } as Post);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deletePost', () => {
    it('should delete a post', () => {
      const mockPost: Post = {
        id: 1,
        title: 'Test Post',
        content: 'This is a test post.',
        authorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        published: true,
        users: {
          id: 1,
          username: 'Test Author',
          email: 'user@example.com',
        },
      };

      spyOn(component.blogService, 'deletePost').and.returnValue(of(mockPost));
      spyOn(component.logger, 'log');

      component.deletePost();

      expect(component.blogService.deletePost).toHaveBeenCalledWith(1);
      expect(component.logger.log).toHaveBeenCalledWith(
        'Post deleted successfully'
      );
    });

    it('should handle post deletion error', () => {
      spyOn(component.logger, 'error');
      spyOn(component.blogService, 'deletePost').and.returnValue(
        throwError(() => new Error('Failed to delete post'))
      );

      component.deletePost();

      expect(component.logger.error).toHaveBeenCalledWith(
        'Failed to delete post: Error: Failed to delete post'
      );
    });
  });
});
