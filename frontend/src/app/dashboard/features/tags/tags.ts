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
import { LoggerService } from '../../../shared/services/logger.service';
import { TagService } from '../../services/tag-service';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteElementDialog } from '../../../shared/components/delete-element-dialog/delete-element-dialog';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

enum TagColumnsEnum {
  ID = 'id',
  NAME = 'name',
  DESCRIPTION = 'description',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  ACTIONS = 'actions',
}

@Component({
  selector: 'app-tags',
  templateUrl: './tags.html',
  styleUrl: './tags.css',
  imports: [
    DashboardContentWrapper,
    MatTableModule,
    DatePipe,
    MatButton,
    MatIconButton,
    MatIcon,
    RouterOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tags {
  protected readonly TagColumnsEnum = TagColumnsEnum;
  private readonly tagService = inject(TagService);
  private readonly router = inject(Router);
  protected readonly currentUrl = signal(this.router.url);
  private readonly dialog = inject(MatDialog);

  protected readonly isMainRoute = computed(() => {
    return this.currentUrl() === '/dashboard/tags';
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
    this.TagColumnsEnum.ID,
    this.TagColumnsEnum.NAME,
    this.TagColumnsEnum.DESCRIPTION,
    this.TagColumnsEnum.CREATED_AT,
    this.TagColumnsEnum.UPDATED_AT,
    this.TagColumnsEnum.ACTIONS,
  ]);

  protected readonly tableData = computed(() => {
    return this.tagService.tags();
  });

  protected openDeleteDialog = (id: number): void => {
    const dialogRef = this.dialog.open(DeleteElementDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tagService.deleteTag(id);
      }
    });
  };

  protected readonly navigateToNewTag = () => {
    this.router.navigate(['/dashboard', 'tags', 'new']);
  };

  protected readonly navigateToTagEdit = (id: string) => {
    this.router.navigate(['/dashboard', 'tags', id]);
  };
}
