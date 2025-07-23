import { computed, inject, Injectable, signal } from '@angular/core';
import { CategoriesService as GeneratedCategoryService } from '../../shared/api/services';
import { LoggerService } from '../../shared/services/logger.service';
import { NotificationService } from '../../shared/services/notification.service';
import { AuthService } from '../../shared/services/auth.service';
import { Category, CategoryPost, CategoryPut } from '../../shared/api/models';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { RouteNames } from '../../shared/interfaces/routes';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly authService = inject(AuthService);
  private readonly generatedCategoryService = inject(GeneratedCategoryService);
  private readonly logger = inject(LoggerService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly categories = signal<Category[]>([]);
  readonly categoriesLoading = signal(false);
  readonly categoriesError = signal<string | null>(null);

  private readonly currentUser = computed(() =>
    this.authService.getLoggedInUser()
  );

  constructor() {
    this.loadCategories();
  }

  private loadCategories(): Subscription {
    this.categoriesLoading.set(true);
    this.categoriesError.set(null);

    return this.generatedCategoryService.apiCategoriesGet().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.categoriesLoading.set(false);
      },
      error: (error) => {
        this.categoriesError.set(error.message);
        this.categoriesLoading.set(false);
        this.logger.error(`Failed to load categories: ${error}`);
      },
    });
  }

  private navigateToCategoryList(): void {
    this.router.navigate([RouteNames.DASHBOARD, RouteNames.CATEGORY]);
  }

  addCategory(category: CategoryPost): void {
    this.categoriesLoading.set(true);
    this.categoriesError.set(null);

    this.generatedCategoryService
      .apiCategoriesPost({ body: category })
      .subscribe({
        next: (newCategory) => {
          this.categories.set([...this.categories(), newCategory]);
          this.notificationService.showNotification(
            'Category added successfully'
          );
          this.categoriesLoading.set(false);
          this.navigateToCategoryList();
        },
        error: (error) => {
          this.categoriesError.set(error.message);
          this.categoriesLoading.set(false);
          this.logger.error(`Failed to add category: ${error}`);
        },
      });
  }

  updateCategory(category: CategoryPut, categoryId: number): void {
    this.categoriesLoading.set(true);
    this.categoriesError.set(null);

    this.generatedCategoryService
      .apiCategoriesCategoryIdPut({ categoryId, body: category })
      .subscribe({
        next: (updatedCategory) => {
          const updatedCategories = this.categories().map((c) =>
            c.id === updatedCategory.id ? updatedCategory : c
          );
          this.categories.set(updatedCategories);
          this.notificationService.showNotification(
            'Category updated successfully'
          );
          this.categoriesLoading.set(false);
          this.navigateToCategoryList();
        },
        error: (error) => {
          this.categoriesError.set(error.message);
          this.categoriesLoading.set(false);
          this.logger.error(`Failed to update category: ${error}`);
        },
      });
  }

  deleteCategory(categoryId: number, navigateToOverview?: boolean): void {
    this.categoriesLoading.set(true);
    this.categoriesError.set(null);

    this.generatedCategoryService
      .apiCategoriesCategoryIdDelete({ categoryId })
      .subscribe({
        next: () => {
          this.categories.set(
            this.categories().filter((c) => c.id !== categoryId)
          );
          this.notificationService.showNotification(
            'Category deleted successfully'
          );
          this.categoriesLoading.set(false);
          if (navigateToOverview) {
            this.navigateToCategoryList();
          }
        },
        error: (error) => {
          this.categoriesError.set(error.message);
          this.categoriesLoading.set(false);
          this.logger.error(`Failed to delete category: ${error}`);
        },
      });
  }

  getCategoryById(categoryId: number): Category | undefined {
    return this.categories().find((c) => c.id === categoryId);
  }
}
