import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
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
import { NotificationService } from '../../../../../../shared/services/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { AiService } from '../../../../../services/ai-service';

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
    MatIconModule,
  ],
  templateUrl: './dialog-add-post.html',
  styleUrl: './dialog-add-post.css',
})
export class DialogAddPost {
  blogService = inject(BlogService);
  logger = inject(LoggerService);
  readonly dialogRef = inject(MatDialogRef<DialogAddPost>);
  notificationService = inject(NotificationService);
  postForm = new FormGroup({
    title: new FormControl('', [...PostInputValidators.title]),
    content: new FormControl('', [...PostInputValidators.content]),
  });
  aiService = inject(AiService);
  isGeneratingContent = this.aiService.isGeneratingContent;

  generateAIContent(): void {
    if (!this.postForm.value.title) {
      this.notificationService.showNotification(
        $localize`:@@dialog-add-post.title-required:Title is required to generate content`
      );
      return;
    }

    this.aiService
      .getGeneratedPostContent(this.postForm.value.title)
      .subscribe({
        next: (data) => {
          this.postForm.patchValue({ content: data.contents });
          this.notificationService.showNotification(
            $localize`:@@dialog-add-post.ai-content-generated:AI content generated successfully`
          );
        },
        error: (error) => {
          this.notificationService.showNotification(
            $localize`:@@dialog-add-post.ai-content-error:Failed to generate AI content: ${error.message}`
          );
          this.logger.error(`Failed to generate AI content: ${error}`);
        },
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.postForm.markAllAsTouched();
    const postData = this.postForm.value;

    if (!postData.title || !postData.content) {
      this.notificationService.showNotification(
        $localize`:@@dialog-add-post.title-content-required:Title and content are required`
      );
      return;
    }

    if (this.postForm.invalid) {
      this.notificationService.showNotification(
        $localize`:@@dialog-add-post.invalid-form:Form is invalid`
      );
      return;
    }

    this.blogService.uploadPost(postData.title, postData.content).subscribe({
      next: () => {
        this.notificationService.showNotification(
          $localize`:@@dialog-add-post.post-created:Post created successfully`
        );
        this.postForm.reset();
        this.dialogRef.close();
      },
      error: (error) => {
        this.notificationService.showNotification(
          $localize`:@@dialog-add-post.post-create-error:Failed to create post`
        );
        this.logger.error(`Failed to create post: ${error}`);
      },
    });
  }
}
