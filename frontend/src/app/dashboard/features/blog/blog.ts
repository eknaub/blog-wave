import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { BlogService } from '../../services/blog-service';
import { DashboardContentWrapper } from '../../dashboard-content-wrapper/dashboard-content-wrapper';
import { BlogPost } from './components/blog-post/blog-post';
import { DialogAddPost } from './components/dialog/dialog-add-post/dialog-add-post';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.html',
  styleUrl: './blog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardContentWrapper, BlogPost, MatIcon, MatButtonModule],
})
export class Blog {
  private readonly blogService = inject(BlogService);
  private readonly dialog = inject(MatDialog);

  protected readonly posts = computed(() => this.blogService.posts());
  protected readonly postsLoading = this.blogService.postsLoading;
  protected readonly postsError = this.blogService.postsError;

  protected openDialog(): void {
    this.dialog.open(DialogAddPost);
  }
}
