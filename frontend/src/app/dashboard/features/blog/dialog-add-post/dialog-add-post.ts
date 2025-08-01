import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
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
import { PostsService } from '../../../services/post-service';
import { LoggerService } from '../../../../shared/services/logger.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { AiService } from '../../../services/ai-service';
import { PostInputValidators } from '../../../../shared/utils/validators';
import { AuthService } from '../../../../shared/services/auth.service';
import { MatOptionModule } from '@angular/material/core';
import { CategoryService } from '../../../services/category-service';
import { TagService } from '../../../services/tag-service';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
})
export class DialogAddPost {
  private readonly postsService = inject(PostsService);
  private readonly logger = inject(LoggerService);
  private readonly dialogRef = inject(MatDialogRef<DialogAddPost>);
  private readonly notificationService = inject(NotificationService);
  private readonly aiService = inject(AiService);
  private readonly authService = inject(AuthService);
  private readonly categoriesService = inject(CategoryService);
  private readonly tagsService = inject(TagService);

  private readonly currentUser = computed(() =>
    this.authService.getLoggedInUser()
  );

  protected readonly categories = this.categoriesService.categories;
  protected readonly tags = this.tagsService.tags;

  protected readonly postForm = new FormGroup({
    title: new FormControl('', [...PostInputValidators.title]),
    content: new FormControl('', [...PostInputValidators.content]),
    categories: new FormControl<number[]>(
      [],
      [...PostInputValidators.categories]
    ),
    tags: new FormControl<number[]>([], [...PostInputValidators.tags]),
    published: new FormControl<boolean>(false),
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

  constructor() {
    effect(() => {
      this.postForm.patchValue({
        content: this.aiService.generatedContent(),
      });
    });
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

    const post = {
      title: postData.title.trim(),
      content: postData.content.trim(),
      categories: postData.categories || [],
      tags: postData.tags || [],
      published: postData.published ?? false,
      authorId: this.currentUser()?.id ?? 0,
    };

    this.postsService.uploadPost(post);

    this.postForm.reset();
    this.dialogRef.close();
    this.isSubmitting.set(false);
  }
}
