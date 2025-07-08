import { Component, inject } from '@angular/core';
import { DashboardContentWrapper } from '../../shared/dashboard-content-wrapper/dashboard-content-wrapper';
import { BlogService } from '../../services/blog-service';
import { BlogPost } from './components/blog-post/blog-post';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPost } from './components/dialog/dialog-add-post/dialog-add-post';

@Component({
  selector: 'app-blog',
  imports: [DashboardContentWrapper, BlogPost, MatIcon, MatButtonModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {
  blogService = inject(BlogService);
  posts = this.blogService.posts;
  postsLoading = this.blogService.postsLoading;
  postsError = this.blogService.postsError;

  readonly dialog = inject(MatDialog);

  openDialog(): void {
    this.dialog.open(DialogAddPost);
  }
}
