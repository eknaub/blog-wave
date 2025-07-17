import { inject, Injectable, signal } from '@angular/core';
import { NotificationService } from '../../shared/services/notification.service';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { Ai } from '../../shared/api/models';
import { AiService as GeneratedAiService } from '../../shared/api/services/ai.service';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private readonly notificationService = inject(NotificationService);
  private readonly generatedAiService = inject(GeneratedAiService);

  readonly isGeneratingContent = signal<boolean>(false);
  readonly generatedContent = signal('');

  getGeneratedPostContent(contents: string): Observable<Ai> {
    this.isGeneratingContent.set(true);

    return this.generatedAiService.apiAiGet({ content: contents }).pipe(
      map((response) => {
        const content = response.contents || '';
        this.generatedContent.set(content);
        this.notificationService.showNotification(
          $localize`:@@ai-service.content-generated:Content generated successfully`
        );
        return response;
      }),
      catchError((error) => {
        this.isGeneratingContent.set(false);
        this.notificationService.showNotification(
          $localize`:@@ai-service.content-generation-error:Failed to generate content`
        );
        console.error('Error generating content:', error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.isGeneratingContent.set(false);
      })
    );
  }

  clearGeneratedContent(): void {
    this.generatedContent.set('');
  }
}
