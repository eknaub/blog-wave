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
import { CategoryService } from '../../../services/category-service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { CategoryInputValidators } from '../../../../shared/utils/validators';
import { CategoryPost, CategoryPut } from '../../../../shared/api/models';
import { MatDialog } from '@angular/material/dialog';
import { DeleteElementDialog } from '../../../../shared/components/delete-element-dialog/delete-element-dialog';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.html',
  styleUrl: './category-details.css',
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
export class CategoryDetails {
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  protected readonly currentUrl = signal(this.router.url);
  protected readonly categoryId = signal<number | null>(
    this.getCategoryIdFromUrl()
  );

  constructor() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.categoryId.set(id ? parseInt(id, 10) : null);
    });

    effect(() => {
      const category = this.categoryData();
      this.categoryForm.patchValue({
        name: category?.name || '',
        description: category?.description || '',
      });
    });
  }

  protected readonly categoryForm = new FormGroup({
    name: new FormControl('', [...CategoryInputValidators.name]),
    description: new FormControl('', [...CategoryInputValidators.description]),
  });

  protected readonly categoryData = computed(() => {
    const id = this.categoryId();
    if (id === null) return null;
    return this.categoryService.getCategoryById(id);
  });

  private getCategoryIdFromUrl() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    return id ? parseInt(id, 10) : null;
  }

  protected readonly isCreateRoute = computed(() => {
    return this.currentUrl().includes('/new');
  });

  protected getTitle(): string {
    return this.isCreateRoute() ? 'New Category' : 'Edit Category';
  }

  protected goBack(): void {
    this.router.navigate(['/dashboard', 'category']);
  }

  protected saveCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    if (this.isCreateRoute()) {
      const categoryPost: CategoryPost = {
        name: this.categoryForm.value.name || '',
        description: this.categoryForm.value.description || '',
      };

      this.categoryService.addCategory(categoryPost);
    } else {
      const id = this.categoryId();
      const categoryPut: CategoryPut = {
        name: this.categoryForm.value.name || '',
        description: this.categoryForm.value.description || '',
      };

      if (id !== null) {
        this.categoryService.updateCategory(categoryPut, id);
      }
    }
  }

  protected openDeleteCategoryDialog = (): void => {
    const dialogRef = this.dialog.open(DeleteElementDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const id = this.categoryId();
        if (id !== null) {
          this.categoryService.deleteCategory(id, true);
        }
      }
    });
  };
}
