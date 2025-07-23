import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { DashboardContentWrapper } from '../../dashboard-content-wrapper/dashboard-content-wrapper';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { CategoryService } from '../../services/category-service';
import { MatIcon } from '@angular/material/icon';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteElementDialog } from '../../../shared/components/delete-element-dialog/delete-element-dialog';
import { LoggerService } from '../../../shared/services/logger.service';

enum CategoryColumnsEnum {
  ID = 'id',
  NAME = 'name',
  DESCRIPTION = 'description',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  ACTIONS = 'actions',
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.html',
  styleUrl: './categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DashboardContentWrapper,
    MatTableModule,
    DatePipe,
    MatButton,
    MatIconButton,
    MatIcon,
    RouterOutlet,
  ],
})
export class Categories {
  protected readonly CategoryColumnsEnum = CategoryColumnsEnum;
  private readonly logger = inject(LoggerService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  protected readonly currentUrl = signal(this.router.url);
  private readonly dialog = inject(MatDialog);

  protected readonly isMainRoute = computed(() => {
    return this.currentUrl() === '/dashboard/category';
  });

  constructor() {
    effect(() => {
      const sub = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl.set(this.router.url);
        }
      });
      return () => sub.unsubscribe();
    });
  }

  protected readonly displayedColumns = signal([
    this.CategoryColumnsEnum.ID,
    this.CategoryColumnsEnum.NAME,
    this.CategoryColumnsEnum.DESCRIPTION,
    this.CategoryColumnsEnum.CREATED_AT,
    this.CategoryColumnsEnum.UPDATED_AT,
    this.CategoryColumnsEnum.ACTIONS,
  ]);

  protected readonly tableData = computed(() => {
    return this.categoryService.categories();
  });

  protected openDeleteDialog = (id: number): void => {
    const dialogRef = this.dialog.open(DeleteElementDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.deleteCategory(id);
      }
    });
  };

  protected readonly navigateToNewCategory = () => {
    this.router.navigate(['/dashboard', 'category', 'new']);
  };

  protected readonly navigateToCategoryEdit = (id: string) => {
    this.router.navigate(['/dashboard', 'category', id]);
  };
}
