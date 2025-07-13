import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPostComment } from './blog-post-comment';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

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

    fixture.componentRef.setInput('postId', '1');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
