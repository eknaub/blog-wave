import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPostComment } from './blog-post-comment';

describe('BlogPostComment', () => {
  let component: BlogPostComment;
  let fixture: ComponentFixture<BlogPostComment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPostComment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogPostComment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
