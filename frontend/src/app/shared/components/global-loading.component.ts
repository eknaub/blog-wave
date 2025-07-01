import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    @if (loadingService.isLoading()) {
      <div class="loading-overlay">
        <mat-progress-spinner
          mode="indeterminate"
          diameter="60"
          strokeWidth="4"
        >
        </mat-progress-spinner>
      </div>
    }
  `,
  styles: [
    `
      .loading-overlay {
        position: fixed;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.32);
        z-index: 2000;
      }
    `,
  ],
})
export class GlobalLoadingComponent {
  loadingService = inject(LoadingService);
}
