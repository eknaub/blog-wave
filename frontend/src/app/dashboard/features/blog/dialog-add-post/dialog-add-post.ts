import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
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
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { BlogService } from '../../../services/blog-service';
import { LoggerService } from '../../../../shared/services/logger.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { AiService } from '../../../services/ai-service';
import { PostInputValidators } from '../../../../shared/utils/validators';

@Component({
  selector: 'app-dialog-add-post',
  templateUrl: './dialog-add-post.html',
  styleUrl: './dialog-add-post.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    MatIconModule,
  ],
})
export class DialogAddPost {
  private readonly blogService = inject(BlogService);
  private readonly logger = inject(LoggerService);
  private readonly dialogRef = inject(MatDialogRef<DialogAddPost>);
  private readonly notificationService = inject(NotificationService);
  private readonly aiService = inject(AiService);

  protected readonly postForm = new FormGroup({
    title: new FormControl('', [...PostInputValidators.title]),
    content: new FormControl('', [...PostInputValidators.content]),
  });

  protected readonly isGeneratingContent = this.aiService.isGeneratingContent;
  protected readonly isSubmitting = signal(false);

  protected get canSubmitForm(): boolean {
    return (
      !this.isSubmitting() && !this.isGeneratingContent() && this.postForm.valid
    );
  }

  protected get canGenerateAIContent(): boolean {
    return !this.isGeneratingContent() && !!this.postForm.value.title?.trim();
  }

  protected generateAIContent(): void {
    const title = this.postForm.value.title?.trim();

    if (!title) {
      this.notificationService.showNotification(
        $localize`:@@dialog-add-post.title-required:Title is required to generate content`
      );
      return;
    }

    this.aiService.getGeneratedPostContent(title);
  }

  protected onNoClick(): void {
    this.dialogRef.close();
  }

  protected onSubmit(): void {
    this.postForm.markAllAsTouched();
    const postData = this.postForm.value;

    if (!postData.title?.trim() || !postData.content?.trim()) {
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

    this.isSubmitting.set(true);

    this.blogService.uploadPost(postData.title, postData.content);

    this.postForm.reset();
    this.dialogRef.close();
    this.isSubmitting.set(false);
  }
}
