import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BlogService } from '../../../../../services/blog-service';
import { MatDividerModule } from '@angular/material/divider';
import { LoggerService } from '../../../../../../shared/services/logger.service';

@Component({
  selector: 'app-dialog-add-post',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogModule,
    ReactiveFormsModule,
    MatDividerModule,
  ],
  templateUrl: './dialog-add-post.html',
  styleUrl: './dialog-add-post.css',
})
export class DialogAddPost {
  blogService = inject(BlogService);
  logger = inject(LoggerService);
  readonly dialogRef = inject(MatDialogRef<DialogAddPost>);
  postForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close();
    this.postForm.markAllAsTouched();
    if (this.postForm.valid) {
      const postData = this.postForm.value;
      this.blogService
        .uploadPost(postData.title ?? '', postData.content ?? '')
        .subscribe({
          next: (post) => {
            this.logger.log(`Post created successfully: ${post}`);
            this.postForm.reset();
          },
          error: (error) => {
            this.logger.error(`Failed to create post: ${error}`);
          },
        });
    }
  }
}
