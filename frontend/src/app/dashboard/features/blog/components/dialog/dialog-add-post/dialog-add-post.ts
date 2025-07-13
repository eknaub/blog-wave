import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
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
import { PostInputValidators } from '../../../../../../shared/utils/validators';
import { CommonModule } from '@angular/common';

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
    CommonModule,
  ],
  templateUrl: './dialog-add-post.html',
  styleUrl: './dialog-add-post.css',
})
export class DialogAddPost {
  blogService = inject(BlogService);
  logger = inject(LoggerService);
  readonly dialogRef = inject(MatDialogRef<DialogAddPost>);
  postForm = new FormGroup({
    title: new FormControl('', [...PostInputValidators.title]),
    content: new FormControl('', [...PostInputValidators.content]),
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close();
    this.postForm.markAllAsTouched();
    const postData = this.postForm.value;

    if (!postData.title || !postData.content) {
      this.logger.error('Title and content are required');
      return;
    }

    if (this.postForm.invalid) {
      this.logger.error('Form is invalid');
      return;
    }

    this.blogService.uploadPost(postData.title, postData.content).subscribe({
      next: () => {
        this.logger.log(`Post created successfully`);
        this.postForm.reset();
      },
      error: () => {
        this.logger.error(`Failed to create post`);
      },
    });
  }
}
