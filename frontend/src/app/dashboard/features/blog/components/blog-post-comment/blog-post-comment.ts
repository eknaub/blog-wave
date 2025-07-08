import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { BlogService } from '../../../../services/blog-service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-blog-post-comment',
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './blog-post-comment.html',
  styleUrl: './blog-post-comment.css',
})
export class BlogPostComment implements OnInit {
  blogService = inject(BlogService);
  postId = input.required<number>();
  panelState = signal(false);
  currentUser = this.blogService.currentUser;

  commentForm = new FormGroup({
    comment: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.blogService.loadCommentsForPost(this.postId());
  }

  comments = computed(() => {
    return this.blogService.getCommentsByPostId(this.postId())();
  });

  submitComment = () => {
    this.commentForm.markAllAsTouched();

    if (this.commentForm.valid) {
      this.blogService
        .uploadCommentToPost(
          this.postId(),
          this.commentForm.value.comment ?? ''
        )
        .subscribe({
          next: (comment) => {
            console.log('Comment uploaded successfully:', comment);
            this.commentForm.reset();
          },
          error: (error) => {
            console.error('Failed to upload comment:', error);
          },
        });
      this.commentForm.reset();
    } else {
      console.error('Comment form is invalid');
    }
  };

  deleteComment = (commentId: number) => {
    this.blogService.deleteComment(this.postId(), commentId).subscribe({
      next: () => {
        console.log('Comment deleted successfully');
      },
      error: (error) => {
        console.error('Failed to delete comment:', error);
      },
    });
  };
}
