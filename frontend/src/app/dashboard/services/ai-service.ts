import { inject, Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../shared/services/http.service';
import { Ai } from '../../shared/interfaces/ai';
import { NotificationService } from '../../shared/services/notification.service';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private baseHttp = inject(BaseHttpService);
  private notificationService = inject(NotificationService);
  isGeneratingContent = signal<boolean>(false);

  getGeneratedPostContent(contents: string) {
    this.isGeneratingContent.set(true);
    return this.baseHttp.get<Ai>(`/ai?content=${contents}`).pipe(
      map((response) => {
        this.isGeneratingContent.set(false);
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
      })
    );
  }
}
