import { computed, inject, Injectable, signal } from '@angular/core';
import { TagsService as GeneratedTagsService } from '../../shared/api/services';
import { LoggerService } from '../../shared/services/logger.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Router } from '@angular/router';
import { Tag, TagPost, TagPut } from '../../shared/api/models';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { RouteNames } from '../../shared/interfaces/routes';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private readonly authService = inject(AuthService);
  private readonly generatedTagsService = inject(GeneratedTagsService);
  private readonly logger = inject(LoggerService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly tags = signal<Tag[]>([]);
  readonly tagsLoading = signal(false);
  readonly tagsError = signal<string | null>(null);

  private readonly currentUser = computed(() =>
    this.authService.getLoggedInUser()
  );

  constructor() {
    this.loadTags();
  }

  private loadTags(): Subscription {
    this.tagsLoading.set(true);
    this.tagsError.set(null);

    return this.generatedTagsService.apiTagsGet().subscribe({
      next: (tags) => {
        this.tags.set(tags);
        this.tagsLoading.set(false);
      },
      error: (error) => {
        this.tagsError.set(error.message);
        this.tagsLoading.set(false);
        this.logger.error(`Failed to load tags: ${error}`);
      },
    });
  }

  private navigateToTagList(): void {
    this.router.navigate([RouteNames.DASHBOARD, RouteNames.TAGS]);
  }

  addTag(tag: TagPost): void {
    this.tagsLoading.set(true);
    this.tagsError.set(null);

    this.generatedTagsService.apiTagsPost({ body: tag }).subscribe({
      next: (newTag) => {
        this.tags.set([...this.tags(), newTag]);
        this.notificationService.showNotification('Tag added successfully');
        this.tagsLoading.set(false);
        this.navigateToTagList();
      },
      error: (error) => {
        this.tagsError.set(error.message);
        this.tagsLoading.set(false);
        this.logger.error(`Failed to add tag: ${error}`);
      },
    });
  }

  updateTag(tag: TagPut, tagId: number): void {
    this.tagsLoading.set(true);
    this.tagsError.set(null);

    this.generatedTagsService.apiTagsTagIdPut({ tagId, body: tag }).subscribe({
      next: (updatedTag) => {
        const updatedTags = this.tags().map((t) =>
          t.id === updatedTag.id ? updatedTag : t
        );
        this.tags.set(updatedTags);
        this.notificationService.showNotification('Tag updated successfully');
        this.tagsLoading.set(false);
        this.navigateToTagList();
      },
      error: (error) => {
        this.tagsError.set(error.message);
        this.tagsLoading.set(false);
        this.logger.error(`Failed to update tag: ${error}`);
      },
    });
  }

  deleteTag(tagId: number, navigateToOverview?: boolean): void {
    this.tagsLoading.set(true);
    this.tagsError.set(null);

    this.generatedTagsService.apiTagsTagIdDelete({ tagId }).subscribe({
      next: () => {
        this.tags.set(this.tags().filter((t) => t.id !== tagId));
        this.notificationService.showNotification('Tag deleted successfully');
        this.tagsLoading.set(false);
        if (navigateToOverview) {
          this.navigateToTagList();
        }
      },
      error: (error) => {
        this.tagsError.set(error.message);
        this.tagsLoading.set(false);
        this.logger.error(`Failed to delete tag: ${error}`);
      },
    });
  }

  getTagById(tagId: number): Tag | undefined {
    return this.tags().find((t) => t.id === tagId);
  }
}
