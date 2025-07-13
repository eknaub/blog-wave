import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogPost } from './blog-post';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Post } from '../../../../../shared/interfaces/post';

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
});
