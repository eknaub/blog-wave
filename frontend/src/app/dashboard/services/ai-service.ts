import { inject, Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../shared/services/http.service';
import { Ai } from '../../shared/interfaces/ai';
import { NotificationService } from '../../shared/services/notification.service';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private readonly baseHttp = inject(BaseHttpService);
  private readonly notificationService = inject(NotificationService);

  readonly isGeneratingContent = signal<boolean>(false);
  readonly generatedContent = signal('');

  getGeneratedPostContent(contents: string): Observable<Ai> {
    this.isGeneratingContent.set(true);

    return this.baseHttp.get<Ai>(`/ai?content=${contents}`).pipe(
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
