import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { TagInputValidators } from '../../../../shared/utils/validators';
import { CategoryPost, CategoryPut } from '../../../../shared/api/models';
import { MatDialog } from '@angular/material/dialog';
import { DeleteElementDialog } from '../../../../shared/components/delete-element-dialog/delete-element-dialog';
import { TagService } from '../../../services/tag-service';

@Component({
  selector: 'app-tags-details',
  templateUrl: './tag-details.html',
  styleUrl: './tag-details.css',
  imports: [
    MatButton,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagDetails {
  private readonly tagService = inject(TagService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  protected readonly currentUrl = signal(this.router.url);
  protected readonly tagsId = signal<number | null>(this.getTagsIdFromUrl());

  constructor() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.tagsId.set(id ? parseInt(id, 10) : null);
    });

    effect(() => {
      const tags = this.tagsData();
      this.tagsForm.patchValue({
        name: tags?.name || '',
        description: tags?.description || '',
      });
    });
  }

  protected readonly tagsForm = new FormGroup({
    name: new FormControl('', [...TagInputValidators.name]),
    description: new FormControl('', [...TagInputValidators.description]),
  });

  protected readonly tagsData = computed(() => {
    const id = this.tagsId();
    if (id === null) return null;
    return this.tagService.getTagById(id);
  });

  private getTagsIdFromUrl() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    return id ? parseInt(id, 10) : null;
  }

  protected readonly isCreateRoute = computed(() => {
    return this.currentUrl().includes('/new');
  });

  protected getTitle(): string {
    return this.isCreateRoute() ? 'New Tag' : 'Edit Tag';
  }

  protected goBack(): void {
    this.router.navigate(['/dashboard', 'tags']);
  }

  protected saveTags(): void {
    if (this.tagsForm.invalid) {
      this.tagsForm.markAllAsTouched();
      return;
    }

    if (this.isCreateRoute()) {
      const tagsPost: CategoryPost = {
        name: this.tagsForm.value.name || '',
        description: this.tagsForm.value.description || '',
      };

      this.tagService.addTag(tagsPost);
    } else {
      const id = this.tagsId();
      const tagsPut: CategoryPut = {
        name: this.tagsForm.value.name || '',
        description: this.tagsForm.value.description || '',
      };

      if (id !== null) {
        this.tagService.updateTag(tagsPut, id);
      }
    }
  }

  protected openDeleteTagsDialog = (): void => {
    const dialogRef = this.dialog.open(DeleteElementDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const id = this.tagsId();
        if (id !== null) {
          this.tagService.deleteTag(id, true);
        }
      }
    });
  };
}
