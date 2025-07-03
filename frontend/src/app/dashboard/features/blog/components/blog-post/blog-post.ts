import { Component, input } from '@angular/core';
import { BlogPostComment } from '../blog-post-comment/blog-post-comment';
import { Post } from '../../../../../shared/interfaces/post';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
  imports: [BlogPostComment, CommonModule],
})
export class BlogPost {
  post = input.required<Post>();
}
