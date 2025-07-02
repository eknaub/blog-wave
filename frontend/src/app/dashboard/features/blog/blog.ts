import { Component, inject } from '@angular/core';
import { DashboardContentWrapper } from '../../shared/dashboard-content-wrapper/dashboard-content-wrapper';
import { BlogService } from '../../services/blog-service';
import { BlogPost } from './components/blog-post/blog-post';

@Component({
  selector: 'app-blog',
  imports: [DashboardContentWrapper, BlogPost],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {
  blogService = inject(BlogService);
  posts = this.blogService.posts;
}
