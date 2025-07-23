import { inject, Injectable, signal } from '@angular/core';
import { NotificationService } from '../../shared/services/notification.service';
import { AiService as GeneratedAiService } from '../../shared/api/services/ai.service';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private readonly notificationService = inject(NotificationService);
  private readonly generatedAiService = inject(GeneratedAiService);

  readonly isGeneratingContent = signal<boolean>(false);
  readonly generatedContent = signal('');

  getGeneratedPostContent(contents: string): void {
    this.isGeneratingContent.set(true);

    this.generatedAiService.apiAiGet({ content: contents }).subscribe({
      next: (response) => {
        const content = response.contents || '';
        this.generatedContent.set(content);
        this.notificationService.showNotification(
          $localize`:@@ai-service.content-generated:Content generated successfully`
        );
      },
      error: (error) => {
        this.notificationService.showNotification(
          $localize`:@@ai-service.content-generation-error:Failed to generate content`
        );
        console.error('Error generating content:', error);
      },
      complete: () => {
        this.isGeneratingContent.set(false);
      },
    });
  }

  clearGeneratedContent(): void {
    this.generatedContent.set('');
  }
}
